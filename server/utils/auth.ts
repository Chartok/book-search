import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const secret = 'mysecretsshhhhh';
const expiration = '2h';

export interface AuthRequest extends Request {
	user?: Record<string, unknown>;
}

export function authMiddleware(
	req: AuthRequest,
	res: Response,
	next: NextFunction
) {
	let token = req.query.token || req.headers.authorization;
	if (req.headers.authorization) {
		token = (token as string).split(' ').pop()?.trim();
	}
	if (!token) {
		return res.status(400).json({ message: 'You have no token!' });
	}
	try {
		const { data } = jwt.verify(token as string, secret, {
			maxAge: expiration,
		}) as { data: Record<string, unknown> };
		req.user = data;
	} catch {
		console.log('Invalid token');
		return res.status(400).json({ message: 'invalid token!' });
	}
	next();
}

export function signToken({
	username,
	email,
	_id,
}: {
	username: string;
	email: string;
	_id: string;
}) {
	const payload = { username, email, _id };
	return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
}
