import 'dotenv/config';
import jwt from 'jsonwebtoken';

const secret = `${process.env.JWT_SECRET}`;
const expiration = `${process.env.JWT_EXPIRATION}`;

export function signToken({ username, email, _id }) {
	const payload = { username, email, _id };
	return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
}

export const authMiddleware = ({ req }: { req: jwt }) => {
	let token = (req.headers.authorization || '').replace(/^Bearer\s+/, '');
	if (token) {
		token = token.trim();
		try {
			const { data } = jwt.verify(token, secret) as { data: jwt };
            console.log('token verified');
			return { user: data };
		} catch {
			console.log('token error; invalid or expired');
		}
	}

	return { user: null };
};

export type GraphQLContext = ReturnType<typeof authMiddleware>;
