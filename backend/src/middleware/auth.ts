import express from 'express';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.ts';

// Define JwtPayload locally to avoid import issues
interface JwtPayload {
	id: number;
	iat?: number;
	exp?: number;
}

interface AuthenticatedRequest extends Request {
	user?: User;
	jwtPayload?: JwtPayload;
}

export async function authMiddleware(
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
): Promise<void> {
	const authHeader = req.headers.authorization;
	const token = authHeader?.startsWith('Bearer ')
		? authHeader.split(' ')[1]
		: undefined;

	if (!token) {
		res.status(401).json({ error: 'Authentication token required' });
		return;
	}

	try {
		// Verify the token directly with jwt
		const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

		// Look up the actual user object
		const user = await User.findByPk(payload.id);
		if (!user) {
			res.status(404).json({ error: 'User not found' });
			return;
		}

		req.user = user;
		req.jwtPayload = payload;
		next();
	} catch (error) {
		res.status(403).json({ error: 'Invalid or expired token' });
	}
}
