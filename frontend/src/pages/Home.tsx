import { useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import BookList from '../components/BookList';
import BookService from '../utils/bookService';
import type { Book } from '../context/types';
import Button from '../components/Button';
import { useAuth } from '../context/authUtils';
import { useLibrary } from '../context/libraryUtils';

export default function Home() {
	const { user } = useAuth();
	const { addBook } = useLibrary();
	const [query, setQuery] = useState('');
	const [books, setBooks] = useState<Book[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSearch = async () => {
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
		<>
			<h1>Search for books</h1>
			<SearchBar value={query} onChange={setQuery} onSubmit={handleSearch} />

			{loading && <p>Loading...</p>}
			{error && <p className='error'>{error}</p>}

			{books.length > 0 ? (
				<BookList
					books={books.map((book) => ({
						...book,
						component: user && (
							<Button
								onClick={() => handleAddBook(book)}
								style={{ marginTop: '0.5rem' }}
								disabled={book.isInLibrary}
							>
								{book.isInLibrary ? 'Added to Library' : 'Add to Library'}
							</Button>
						),
					}))}
				/>
			) : query && !loading ? (
				<p>No books found matching "{query}". Try another search term.</p>
			) : !query ? (
				<div style={{ textAlign: 'center', margin: '2rem 0' }}>
					<p>Search for books above to get started.</p>
					{user ? (
						<Link to='/library'>
							<Button style={{ marginTop: '1rem' }}>Go to My Library</Button>
						</Link>
					) : (
						<p>
							<span style={{ fontSize: '0.9rem' }}>
								Sign in to save books to your library.
							</span>
						</p>
					)}
				</div>
			) : null}
		</>
	);
}
