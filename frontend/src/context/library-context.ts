import { createContext } from 'react';
import type { LibraryContextShape } from './types';

// Create the context
export const LibraryContext = createContext<LibraryContextShape | undefined>(
	undefined
);
