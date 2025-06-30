import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function authMiddleware(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const token = req.headers.authorization?.split(' ')[1];
	if (!token) return res.sendStatus(401);

	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET!);
		req.user = payload as any;
		next();
	} catch {
		res.sendStatus(403);
	}
}
