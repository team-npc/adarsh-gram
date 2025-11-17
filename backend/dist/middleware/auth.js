"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireOwnershipOrAdmin = exports.requireLocationAccess = exports.requireRole = exports.authenticateToken = void 0;
const jwt_1 = require("../utils/jwt");
const database_1 = __importDefault(require("../config/database"));
const authenticateToken = async (req, res, next) => {
    try {
        const token = (0, jwt_1.extractTokenFromHeader)(req.headers.authorization);
        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Access token required',
                error: 'MISSING_TOKEN',
            });
            return;
        }
        const decoded = (0, jwt_1.verifyAccessToken)(token);
        const userQuery = `
      SELECT id, email, role, state, district, block, village, is_active
      FROM users 
      WHERE id = $1 AND is_active = true
    `;
        const userResult = await database_1.default.query(userQuery, [decoded.userId]);
        if (userResult.rows.length === 0) {
            res.status(401).json({
                success: false,
                message: 'User not found or inactive',
                error: 'INVALID_USER',
            });
            return;
        }
        const user = userResult.rows[0];
        req.user = {
            ...decoded,
            location: {
                state: user.state,
                district: user.district,
                block: user.block,
                village: user.village,
            },
        };
        next();
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
        res.status(401).json({
            success: false,
            message: errorMessage,
            error: 'AUTHENTICATION_FAILED',
        });
    }
};
exports.authenticateToken = authenticateToken;
const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Authentication required',
                error: 'NOT_AUTHENTICATED',
            });
            return;
        }
        if (!allowedRoles.includes(req.user.role)) {
            res.status(403).json({
                success: false,
                message: 'Insufficient permissions',
                error: 'INSUFFICIENT_PERMISSIONS',
            });
            return;
        }
        next();
    };
};
exports.requireRole = requireRole;
const requireLocationAccess = (level) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Authentication required',
                error: 'NOT_AUTHENTICATED',
            });
            return;
        }
        if (req.user.role === 'system_admin') {
            next();
            return;
        }
        const userLocation = req.user.location;
        const requestedLocation = {
            state: req.params.state || req.body.state || req.query.state,
            district: req.params.district || req.body.district || req.query.district,
            block: req.params.block || req.body.block || req.query.block,
            village: req.params.village || req.body.village || req.query.village,
        };
        switch (req.user.role) {
            case 'district_admin':
                if (userLocation.state !== requestedLocation.state ||
                    userLocation.district !== requestedLocation.district) {
                    res.status(403).json({
                        success: false,
                        message: 'Access denied: Outside your district jurisdiction',
                        error: 'LOCATION_ACCESS_DENIED',
                    });
                    return;
                }
                break;
            case 'block_officer':
                if (userLocation.state !== requestedLocation.state ||
                    userLocation.district !== requestedLocation.district ||
                    userLocation.block !== requestedLocation.block) {
                    res.status(403).json({
                        success: false,
                        message: 'Access denied: Outside your block jurisdiction',
                        error: 'LOCATION_ACCESS_DENIED',
                    });
                    return;
                }
                break;
            case 'village_reporter':
                if (userLocation.state !== requestedLocation.state ||
                    userLocation.district !== requestedLocation.district ||
                    userLocation.block !== requestedLocation.block ||
                    userLocation.village !== requestedLocation.village) {
                    res.status(403).json({
                        success: false,
                        message: 'Access denied: Outside your village jurisdiction',
                        error: 'LOCATION_ACCESS_DENIED',
                    });
                    return;
                }
                break;
            default:
                if (level === 'village' && userLocation.village !== requestedLocation.village) {
                    res.status(403).json({
                        success: false,
                        message: 'Access denied: Village level access required',
                        error: 'LOCATION_ACCESS_DENIED',
                    });
                    return;
                }
        }
        next();
    };
};
exports.requireLocationAccess = requireLocationAccess;
const requireOwnershipOrAdmin = (resourceType) => {
    return async (req, res, next) => {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Authentication required',
                error: 'NOT_AUTHENTICATED',
            });
            return;
        }
        if (['system_admin', 'district_admin'].includes(req.user.role)) {
            next();
            return;
        }
        const resourceId = req.params.id;
        if (!resourceId) {
            res.status(400).json({
                success: false,
                message: 'Resource ID required',
                error: 'MISSING_RESOURCE_ID',
            });
            return;
        }
        try {
            let query;
            let ownerField;
            switch (resourceType) {
                case 'problem_report':
                    query = 'SELECT reporter_id FROM problem_reports WHERE id = $1';
                    ownerField = 'reporter_id';
                    break;
                case 'assessment':
                    query = 'SELECT assessor_id FROM assessments WHERE id = $1';
                    ownerField = 'assessor_id';
                    break;
                default:
                    res.status(400).json({
                        success: false,
                        message: 'Invalid resource type',
                        error: 'INVALID_RESOURCE_TYPE',
                    });
                    return;
            }
            const result = await database_1.default.query(query, [resourceId]);
            if (result.rows.length === 0) {
                res.status(404).json({
                    success: false,
                    message: 'Resource not found',
                    error: 'RESOURCE_NOT_FOUND',
                });
                return;
            }
            const ownerId = result.rows[0][ownerField];
            if (ownerId !== req.user.userId) {
                res.status(403).json({
                    success: false,
                    message: 'Access denied: You can only modify your own resources',
                    error: 'OWNERSHIP_REQUIRED',
                });
                return;
            }
            next();
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error checking resource ownership',
                error: 'OWNERSHIP_CHECK_FAILED',
            });
        }
    };
};
exports.requireOwnershipOrAdmin = requireOwnershipOrAdmin;
//# sourceMappingURL=auth.js.map