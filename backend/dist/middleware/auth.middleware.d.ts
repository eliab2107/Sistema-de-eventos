import { Request, Response, NextFunction } from 'express';
interface AuthRequest extends Request {
    userId?: string;
    userEmail?: string;
}
declare const authMiddleware: (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export default authMiddleware;
export type { AuthRequest };
