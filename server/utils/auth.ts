import jwt, { JwtPayload } from 'jsonwebtoken';

const secret = 'mysecretsshhhhh';
const expiration = '2h';

export function signToken({ username, email, _id }) {
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
