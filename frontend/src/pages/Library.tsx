import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import BookList from '../components/BookList';
import { useAuth } from '../context/authUtils';
import { useLibrary } from '../context/libraryUtils';
import type { Book } from '../context/types';
import Button from '../components/Button';
import BookService from '../utils/bookService';

export default function Library() {
	const { user } = useAuth();
	const {
		shelves,
		addBook,
		moveBook,
		removeBook,
		refreshLibrary,
		loading: libraryLoading,
		error: libraryError,
	} = useLibrary();
	const [query, setQuery] = useState('');
	const [searchResults, setSearchResults] = useState<Book[]>([]);
	const [searching, setSearching] = useState(false);
	const [searchError, setSearchError] = useState<string | null>(null);

	// Refresh library when component mounts
	useEffect(() => {
		if (user) {
			refreshLibrary();
		}
	}, [user, refreshLibrary]);

	// Redirect if not logged in
	if (!user) return <Navigate to='/' replace />;

	const handleSearch = async () => {
		if (!query.trim()) return;

		try {
			setSearching(true);
			setSearchError(null);

			const response = await BookService.search(query);

			// Filter out books that are already in the library
			const allLibraryBookIds = [
				...shelves.next.map((b) => b.id),
				...shelves.finished.map((b) => b.id),
			];

			const filteredResults = response.books.filter(
				(book) => !allLibraryBookIds.includes(book.id)
			);

			setSearchResults(filteredResults);
		} catch (err: Error | unknown) {
			console.error('Search error:', err);
			setSearchError('Failed to search books. Please try again.');
		} finally {
			setSearching(false);
		}
	};

	const handleAddBook = async (book: Book) => {
		await addBook(book, 'next');
		// Remove from search results after adding
		setSearchResults((prev) => prev.filter((b) => b.id !== book.id));
	};

	return (
		<>
			<h1>Your library</h1>
			<h2>Add more</h2>
			<SearchBar value={query} onChange={setQuery} onSubmit={handleSearch} />

			{searching && <p>Searching...</p>}
			{searchError && <p className='error'>{searchError}</p>}

			{searchResults.length > 0 ? (
				<BookList
					books={searchResults.map((b) => ({
						...b,
						// quick add button
						component: (
							<Button
								onClick={() => handleAddBook(b)}
								style={{ marginTop: '0.5rem' }}
							>
								Save as "next"
							</Button>
						),
					}))}
				/>
			) : (
				query && !searching && <p>No new books found for "{query}"</p>
			)}

			{libraryLoading && <p>Loading your library...</p>}
			{libraryError && <p className='error'>{libraryError}</p>}

			<h2>Next up {shelves.next.length > 0 && `(${shelves.next.length})`}</h2>
			{shelves.next.length > 0 ? (
				<BookList
					books={shelves.next.map((b) => ({
						...b,
						component: (
							<div
								style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}
							>
								<Button onClick={() => moveBook(b.id, 'finished')}>
									Mark finished
								</Button>
								<Button onClick={() => removeBook(b.id)}>Remove</Button>
							</div>
						),
					}))}
				/>
			) : (
				<p>You don't have any books in your "Next up" list yet.</p>
			)}

			<h2>
				Finished {shelves.finished.length > 0 && `(${shelves.finished.length})`}
			</h2>
			{shelves.finished.length > 0 ? (
				<BookList
					books={shelves.finished.map((b) => ({
						...b,
						component: (
							<Button
								onClick={() => removeBook(b.id)}
								style={{ marginTop: '0.5rem' }}
							>
								Remove
							</Button>
						),
					}))}
				/>
			) : (
				<p>You haven't finished any books yet.</p>
			)}
		</>
	);
}
