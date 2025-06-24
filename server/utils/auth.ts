import jwt, { JwtPayload } from 'jsonwebtoken';

const secret = 'mysecretsshhhhh';
const expiration = '2h';

<<<<<<< HEAD
export interface AuthRequest extends Request {
	user?: Record<string, unknown>;
	{
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
=======
export function signToken({ username, email, _id }) {
>>>>>>> 6b36f2de9d46905062e2ab1260eedf8f21675362
	const payload = { username, email, _id };
	return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
}

export const authMiddleware = ({ req }: { req: Request }) => {
	//    let user = null;
	let token = (req.headers.authorization || '').replace(/^Bearer\s+/, '');
	if (token) {
		token = token.trim();
		try {
			const { data } = jwt.verify(token, secret) as { data: JwtPayload };
            console.log('token verified');
			return { user: data };
		} catch {
			console.log('token error; invalid or expired');
		}
	}

	return { user: null };
};
