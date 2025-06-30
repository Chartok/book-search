import { JwtPayload } from '../utils/token';

// 9. types/index.d.ts
declare namespace Express {
	export interface Request {
		user?: JwtPayload;
	}
}
