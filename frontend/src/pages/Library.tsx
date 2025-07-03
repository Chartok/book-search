import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/authUtils';
import { useLibrary } from '../context/libraryUtils';
import type { Book } from '../context/types';
import BookService from '../utils/bookService';

export default function Library() {
	const { user } = useAuth();
	const {
		shelves,
		addBook,
		moveBook,
		removeBook,
		refreshLibrary,
		loading,
		error,
	} = useLibrary();
	const [query, setQuery] = useState('');
	const [results, setResults] = useState<Book[]>([]);
	const [searching, setSearching] = useState(false);

	useEffect(() => {
		if (user) refreshLibrary();
	}, [user, refreshLibrary]);

	if (!user) return <Navigate to='/' replace />;

	const handleSearch = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!query.trim()) return;
		try {
			setSearching(true);
			const response = await BookService.search(query);
			const libraryIds = [
				...shelves.next.map((b) => b.id),
				...shelves.finished.map((b) => b.id),
			];
			setResults(response.books.filter((b) => !libraryIds.includes(b.id)));
		} finally {
			setSearching(false);
		}
	};

	const handleAdd = async (book: Book) => {
		await addBook(book, 'next');
		setResults((r) => r.filter((b) => b.id !== book.id));
	};

	const renderBook = (book: Book, actions: React.ReactNode) => (
		<li key={book.id} className='border p-2'>
			<h3 className='font-semibold'>{book.title}</h3>
			{book.authors && <p className='text-sm'>{book.authors.join(', ')}</p>}
			{actions}
		</li>
	);

	return (
		<div className='max-w-3xl mx-auto p-4'>
			<h1 className='text-xl font-bold mb-4'>Your library</h1>

			<form onSubmit={handleSearch} className='flex mb-4'>
				<input
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder='Search for books'
					className='flex-grow border px-2 py-1'
				/>
				<button type='submit' className='ml-2 px-3 py-1 bg-blue-600 text-white'>
					Search
				</button>
			</form>
			{searching && <p>Searching...</p>}
			{results.length > 0 && (
				<ul className='grid gap-2 mb-6'>
					{results.map((b) =>
						renderBook(
							b,
							<button
								onClick={() => handleAdd(b)}
								className='mt-1 px-2 py-1 text-sm bg-blue-600 text-white'
							>
								Save
							</button>
						)
					)}
				</ul>
			)}

			{loading && <p>Loading your library...</p>}
			{error && <p className='text-red-500'>{error}</p>}

			<h2 className='font-semibold mt-4'>Next up</h2>
			{shelves.next.length > 0 ? (
				<ul className='grid gap-2 mb-6'>
					{shelves.next.map((b) =>
						renderBook(
							b,
							<div className='flex gap-2 mt-1'>
								<button
									onClick={() => moveBook(b.id, 'finished')}
									className='px-2 py-1 text-sm bg-green-600 text-white'
								>
									Finish
								</button>
								<button
									onClick={() => removeBook(b.id)}
									className='px-2 py-1 text-sm bg-red-600 text-white'
								>
									Remove
								</button>
							</div>
						)
					)}
				</ul>
			) : (
				<p>No books in this list.</p>
			)}

			<h2 className='font-semibold mt-4'>Finished</h2>
			{shelves.finished.length > 0 ? (
				<ul className='grid gap-2'>
					{shelves.finished.map((b) =>
						renderBook(
							b,
							<button
								onClick={() => removeBook(b.id)}
								className='mt-1 px-2 py-1 text-sm bg-red-600 text-white'
							>
								Remove
							</button>
						)
					)}
				</ul>
			) : (
				<p>You haven't finished any books.</p>
			)}
		</div>
	);	
}

