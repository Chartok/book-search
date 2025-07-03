import { useState } from 'react';
import { useAuth } from '../context/authUtils';
import { useLibrary } from '../context/libraryUtils';
import type { Book } from '../context/types';
import BookService from '../utils/bookService';
import { useForm } from '../hooks/hooks';

interface FormValues {
	searchQuery: string;
	[key: string]: unknown; // Add index signature for additional properties
}

export default function SearchBook() {
	const { user } = useAuth();
	const { addBook } = useLibrary();
	const [books, setBooks] = useState<Book[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { values, handleChange, handleSubmit } = useForm<FormValues>({
		initialValues: { searchQuery: '' },
		onSubmit: async ({ searchQuery }) => {
			if (!searchQuery.trim()) return;
			try {
				setLoading(true);
				setError(null);
				const response = await BookService.search(searchQuery);
				setBooks(response.books);
			} catch {
				setError('Failed to search books.');
			} finally {
				setLoading(false);
			}
		},
	});

	const handleAddBook = async (book: Book) => {
		if (!user) return;
		await addBook(book, 'next');
		setBooks(
			books.map((b) => (b.id === book.id ? { ...b, isInLibrary: true } : b))
		);
	};

	return (
		<div className='max-w-3xl mx-auto'>
			<form onSubmit={handleSubmit} className='flex mb-4'>
				<input
					type='text'
					name='searchQuery'
					value={values.searchQuery}
					onChange={handleChange}
					placeholder='Search books'
					className='flex-grow border px-2 py-1'
				/>
				<button type='submit' className='ml-2 px-3 py-1 bg-blue-600 text-white'>
					Search
				</button>
			</form>

			{loading && <p>Loading...</p>}
			{error && <p className='text-red-500'>{error}</p>}
			{books.length > 0 && (
				<ul className='grid gap-4'>
					{books.map((book) => (
						<li key={book.id} className='border p-4'>
							{book.cover && (
								<img src={book.cover} alt={book.title} className='h-40 mb-2' />
							)}
							<h3 className='font-semibold'>{book.title}</h3>
							{book.authors && (
								<p className='text-sm'>By {book.authors.join(', ')}</p>
							)}
							{book.description && (
								<p className='text-sm mt-2'>{book.description}</p>
							)}
							{user && (
								<button
									onClick={() => handleAddBook(book)}
									disabled={book.isInLibrary}
									className='mt-2 px-3 py-1 text-sm bg-blue-600 text-white'
								>
									{book.isInLibrary ? 'Added' : 'Add to Library'}
								</button>
							)}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
