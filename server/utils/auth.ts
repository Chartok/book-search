import jwt from 'jsonwebtoken';

const secret = 'mysecretsshhhhh';
const expiration = '2h';

export function signToken({ username, email, _id }) {
	const payload = { username, email, _id };
	return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
};

export const authMiddleware = async ({ req }) => {
    let user = null;
    let token = req.headers.authorization || '';
    if (token) {
        token = token.replace('Bearer', '').trim();
        try {
            const { data } = jwt.verify(token, secret, { maxAge: expiration });
            user = data;
        } catch (error) {
            console.log('token error; invalid or expired');
            user = null;
        }
    }

    return { user };
};
