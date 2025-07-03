import { useContext } from 'react';
import { LibraryContext } from './library-context';

export function useLibrary() {
	const ctx = useContext(LibraryContext);
	if (!ctx) throw new Error('useLibrary outside provider');
	return ctx;
}
