import jwt from 'jsonwebtoken';

// Define the interface but export as a type
export type JwtPayload = {
	id: number; // This will store the _id value
	iat?: number;
	exp?: number;
}

export function verifyToken(token: string): JwtPayload {
	try {
		const secret = process.env.JWT_SECRET;
		if (!secret) {
			throw new Error('JWT secret is not defined');
		}
		return jwt.verify(token, secret) as JwtPayload;
	} catch (error) {
		throw new Error('Invalid or expired token');
	}
}

export function generateToken(userId: number): string {
	return jwt.sign({ id: userId }, process.env.JWT_SECRET!, { expiresIn: '7d' });
}


