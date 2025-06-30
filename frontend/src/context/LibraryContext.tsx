import type { ReactNode } from 'react';
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from './authUtils';
import type { Book, Shelf } from './types';
import BookService from '../utils/bookService';
import { LibraryContext } from './library-context';

export function LibraryProvider({ children }: { children: ReactNode }) {
	const { user, token } = useAuth();
	const [shelves, setShelves] = useState<Record<Shelf, Book[]>>({
		next: [],
		finished: [],
	});
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	// Wrap refreshLibrary in useCallback to avoid dependency issues
	const refreshLibrary = useCallback(async () => {
		if (!user || !token) return;

		try {
			setLoading(true);
			setError(null);

			const savedBooks = await BookService.getSavedBooks();

			// Sort books into shelves
			const nextBooks: Book[] = [];
			const finishedBooks: Book[] = [];

			savedBooks.forEach((savedBook) => {
				if (savedBook.shelf === 'next') {
					nextBooks.push(savedBook.book);
				} else if (savedBook.shelf === 'finished') {
					finishedBooks.push(savedBook.book);
				}
			});

			setShelves({
				next: nextBooks,
				finished: finishedBooks,
			});
		} catch (err: Error | unknown) {
			console.error('Error fetching library:', err);
			const error = err as { response?: { data?: { error?: string } } };
			setError(error.response?.data?.error || 'Failed to load your library');
		} finally {
			setLoading(false);
		}
	}, [user, token]);

	// Fetch user's saved books when authenticated
	useEffect(() => {
		if (user && token) {
			refreshLibrary();
		} else {
			// Reset shelves when logged out
			setShelves({ next: [], finished: [] });
		}
	}, [user, token, refreshLibrary]);

	const addBook = async (book: Book, shelf: Shelf) => {
		if (!user || !token) return;

		try {
			setLoading(true);
			setError(null);

			// Use the BookService to save the book
			await BookService.saveBook(book.id, shelf);

			// Update local state
			setShelves((prev) => ({
				...prev,
				[shelf]: prev[shelf].some((b) => b.id === book.id)
					? prev[shelf]
					: [...prev[shelf], book],
			}));
		} catch (err: Error | unknown) {
			console.error('Error adding book:', err);
			const error = err as { response?: { data?: { error?: string } } };
			setError(
				error.response?.data?.error || 'Failed to add book to your library'
			);
		} finally {
			setLoading(false);
		}
	};

	const moveBook = async (id: string, to: Shelf) => {
		if (!user || !token) return;

		try {
			setLoading(true);
			setError(null);

			// Use the BookService to update the shelf
			await BookService.updateBookShelf(id, to);

			// Update local state
			setShelves((prev) => {
				const from: Shelf = to === 'next' ? 'finished' : 'next';
				const book = prev[from].find((b) => b.id === id);
				if (!book) return prev;

				return {
					next:
						to === 'next'
							? [...prev.next, book]
							: prev.next.filter((b) => b.id !== id),
					finished:
						to === 'finished'
							? [...prev.finished, book]
							: prev.finished.filter((b) => b.id !== id),
				};
			});
		} catch (err: Error | unknown) {
			console.error('Error moving book:', err);
			const error = err as { response?: { data?: { error?: string } } };
			setError(error.response?.data?.error || 'Failed to update book');
		} finally {
			setLoading(false);
		}
	};

	const removeBook = async (id: string) => {
		if (!user || !token) return;

		try {
			setLoading(true);
			setError(null);

			// Use the BookService to remove the book
			await BookService.removeBook(id);

			// Update local state
			setShelves((prev) => ({
				next: prev.next.filter((b) => b.id !== id),
				finished: prev.finished.filter((b) => b.id !== id),
			}));
		} catch (err: Error | unknown) {
			console.error('Error removing book:', err);
			const error = err as { response?: { data?: { error?: string } } };
			setError(error.response?.data?.error || 'Failed to remove book');
		} finally {
			setLoading(false);
		}
	};

	return (
		<LibraryContext.Provider
			value={{
				shelves,
				addBook,
				moveBook,
				removeBook,
				loading,
				error,
				refreshLibrary,
			}}
		>
			{children}
		</LibraryContext.Provider>
	);
}
