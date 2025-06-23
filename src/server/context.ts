import { ExpressContextFunctionArgument } from '@apollo/server/dist/express4';
import jwt from 'jsonwebtoken';

const SECRET = 'replace-this-secret';

export interface AuthUser {
  id: string;
  email: string;
}

export function createContext({ req }: ExpressContextFunctionArgument) {
  const auth = req.headers.authorization || '';
  if (auth.startsWith('Bearer ')) {
    const token = auth.slice(7);
    try {
      const user = jwt.verify(token, SECRET) as AuthUser;
      return { user };
    } catch {
      return { user: null };
    }
  }
  return { user: null };
}
