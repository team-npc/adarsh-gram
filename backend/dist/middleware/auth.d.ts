import { Request, Response, NextFunction } from 'express';
import { UserRole, JWTPayload } from '../types';
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
export declare const authenticateToken: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const requireRole: (allowedRoles: UserRole[]) => (req: Request, res: Response, next: NextFunction) => void;
export declare const requireLocationAccess: (level: "state" | "district" | "block" | "village") => (req: Request, res: Response, next: NextFunction) => void;
export declare const requireOwnershipOrAdmin: (resourceType: "problem_report" | "assessment") => (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=auth.d.ts.map