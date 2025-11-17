import { JWTPayload, UserRole } from '../types';
export interface TokenPair {
    accessToken: string;
    refreshToken: string;
}
export declare const generateTokens: (userId: string, email: string, role: UserRole) => TokenPair;
export declare const verifyAccessToken: (token: string) => JWTPayload;
export declare const verifyRefreshToken: (token: string) => {
    userId: string;
};
export declare const extractTokenFromHeader: (authHeader: string | undefined) => string | null;
export declare const getTokenExpiration: (token: string) => Date | null;
//# sourceMappingURL=jwt.d.ts.map