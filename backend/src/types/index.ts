import { JwtPayload } from '../utils/token';
import { User } from '../models/User';

// Extend Express Request interface globally
declare global {
	namespace Express {
		interface Request {
			user?: User;
			jwtPayload?: JwtPayload;
		}
	}
}

export {}; // Make this a module
