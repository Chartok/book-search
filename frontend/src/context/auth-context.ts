import { createContext } from 'react';
import type { AuthContextShape } from './types';

// Create the context
export const AuthContext = createContext<AuthContextShape | undefined>(
	undefined
);
