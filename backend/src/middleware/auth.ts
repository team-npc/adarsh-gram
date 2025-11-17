import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, extractTokenFromHeader } from '../utils/jwt';
import { UserRole, JWTPayload } from '../types';
import pool from '../config/database';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload & {
        location: {
          state: string;
          district: string;
          block?: string;
          village?: string;
        };
      };
    }
  }
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    
    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Access token required',
        error: 'MISSING_TOKEN',
      });
      return;
    }

    const decoded = verifyAccessToken(token);
    
    // Verify user still exists and is active
    const userQuery = `
      SELECT id, email, role, state, district, block, village, is_active
      FROM users 
      WHERE id = $1 AND is_active = true
    `;
    
    const userResult = await pool.query(userQuery, [decoded.userId]);
    
    if (userResult.rows.length === 0) {
      res.status(401).json({
        success: false,
        message: 'User not found or inactive',
        error: 'INVALID_USER',
      });
      return;
    }

    const user = userResult.rows[0];
    
    // Attach user info to request
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
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
    
    res.status(401).json({
      success: false,
      message: errorMessage,
      error: 'AUTHENTICATION_FAILED',
    });
  }
};

export const requireRole = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
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

export const requireLocationAccess = (
  level: 'state' | 'district' | 'block' | 'village'
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
        error: 'NOT_AUTHENTICATED',
      });
      return;
    }

    // System admins have access to everything
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

    // Check access based on user role and location
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
        // For assessors and viewers, check based on the level required
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

export const requireOwnershipOrAdmin = (resourceType: 'problem_report' | 'assessment') => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
        error: 'NOT_AUTHENTICATED',
      });
      return;
    }

    // System and district admins can access everything
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
      let query: string;
      let ownerField: string;

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

      const result = await pool.query(query, [resourceId]);
      
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
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error checking resource ownership',
        error: 'OWNERSHIP_CHECK_FAILED',
      });
    }
  };
};