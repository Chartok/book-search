import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/authUtils';
import { useLibrary } from '../context/libraryUtils';
import type { Book } from '../context/types';
import BookService from '../utils/bookService';
import SearchBar from '../components/SearchBar';
import BookList from '../components/BookList';

export default function Home() {
	const { user } = useAuth();
	const { addBook } = useLibrary();
	const [query, setQuery] = useState('');
	const [books, setBooks] = useState<Book[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSearch = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!query.trim()) return;

		try {
			setLoading(true);
			setError(null);

			const response = await BookService.search(query);
			setBooks(response.books);
		} catch (err: Error | unknown) {
			console.error('Search error:', err);
			setError('Failed to search books. Please try again.');
		} finally {
			setLoading(false);
		}
	};

const handleAddBook = async (book: Book) => {
	if (!user) return;
	await addBook(book, 'next');
	// Update UI to show book was added
	setBooks(
		books.map((b) => (b.id === book.id ? { ...b, isInLibrary: true } : b))
	);
};

	return (
		<div className="max-w-4xl mx-auto">
			<h1 className="text-2xl md:text-3xl font-bold text-center mb-6">Search for books</h1>
			<SearchBar value={query} onChange={setQuery} onSubmit={handleSearch} />

			{loading && <p className="text-center">Loading...</p>}
			{error && <p className="text-red-500 text-center">{error}</p>}

			{books.length > 0 ? (
				<BookList
					books={books.map((book) => ({
						...book,
						component: user && (
							<button
								onClick={() => handleAddBook(book)}
								disabled={book.isInLibrary}
								className={`mt-2 px-3 py-1 text-sm rounded ${
									book.isInLibrary
										? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
										: 'bg-blue-600 hover:bg-blue-700 text-white'
								}`}
							>
								{book.isInLibrary ? '✓ Added to Library' : 'Add to Library'}
							</button>
						),
					}))}
				/>
			) : query && !loading ? (
				<p className="text-center text-gray-600 dark:text-gray-400">No books found matching "{query}". Try another search term.</p>
			) : !query ? (
				<div className="text-center my-12">
					<p className="text-gray-600 dark:text-gray-400 mb-4">Search for books above to get started.</p>
					{user ? (
						<Link to='/library'>
							<button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
								Go to My Library
							</button>
						</Link>
					) : (
						<p className="text-sm text-gray-500 dark:text-gray-400">
							Sign in to save books to your library.
						</p>
					)}
				</div>
			) : null}
		</div>
	);
}
