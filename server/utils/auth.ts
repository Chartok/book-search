import 'dotenv/config';
import jwt from 'jsonwebtoken';

const secret = `${process.env.JWT_SECRET}`;
const expiration = `${process.env.JWT_EXPIRATION}`;

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

export const authMiddleware = ({ req }: { req: jwt }) => {
	let token = (req.headers.authorization || '').replace(/^Bearer\s+/, '');
	if (token) {
		token = token.trim();
		try {
			const { data } = jwt.verify(token, secret) as {
				data: { username: string; email: string; _id: string };
			};
			// Token verified successfully
			return { user: data };
		} catch {
			// Token error; invalid or expired
		}
	}

	return { user: null };
};

/**
 * The context type for GraphQL resolvers, containing the authenticated user or null.
 */
export type GraphQLContext = ReturnType<typeof authMiddleware>;
export default { authMiddleware, signToken };
