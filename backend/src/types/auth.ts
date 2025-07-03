import { Request } from 'express';
import { User } from '../models/User';
import { JwtPayload } from '../utils/token';

// Type guard to check if request has authenticated user
export function isAuthenticatedRequest(req: Request): req is Request & {
	user: User;
	jwtPayload: JwtPayload;
} {
	return (
		(req as any).user !== undefined && (req as any).jwtPayload !== undefined
	);
}

// Authenticated request type for use in route handlers
export interface AuthenticatedRequest extends Request {
	user: User;
	jwtPayload: JwtPayload;
}

// Environment variables type for better type safety
declare global {
	namespace NodeJS {
		interface ProcessEnv {
			JWT_SECRET: string;
			NODE_ENV: 'development' | 'production' | 'test';
			PORT?: string;
			DB_URI?: string;
		}
	}
}
