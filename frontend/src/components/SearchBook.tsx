import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/authUtils';
import { useLibrary } from '../context/libraryUtils';
import type { Book } from '../context/types';
import BookService from '../utils/bookService';
import { useForm } from '../hooks/hooks';

interface FormValues {
	searchQuery: string;
  [key: string]: unknown; // Add index signature for additional properties
}

interface SearchBookProps {
	className?: string;
}

export default function SearchBook({ className = '' }: SearchBookProps) {
	const { user } = useAuth();
	const { addBook } = useLibrary();
	const [books, setBooks] = useState<Book[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const { values, handleChange, handleSubmit } = useForm<FormValues>({
		initialValues: { searchQuery: '' },
		onSubmit: async (values: FormValues) => {
			if (!values.searchQuery.trim()) return;

			try {
				setLoading(true);
				setError(null);

				const response = await BookService.search(values.searchQuery);
				setBooks(response.books);
			} catch (err) {
				console.error('Search error:', err);
				setError('Failed to search books. Please try again.');
			} finally {
				setLoading(false);
			}
		},
	});

	const handleAddBook = async (book: Book) => {
		if (!user) return;
		try {
			await addBook(book, 'next');
			// Update UI to show book was added
			setBooks(
				books.map((b) => (b.id === book.id ? { ...b, isInLibrary: true } : b))
			);
		} catch (err) {
			console.error('Failed to add book:', err);
			setError('Failed to add book to your library. Please try again.');
		}
	};

	return (
		<div className={`max-w-4xl mx-auto ${className}`}>
			<form onSubmit={handleSubmit} className='flex w-full mb-6'>
				<div className='relative flex-grow'>
					<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
						<svg
							className='w-6 h-6 text-gray-600'
							fill='currentColor'
							viewBox='0 0 20 20'
						>
							<path
								fillRule='evenodd'
								d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z'
								clipRule='evenodd'
							/>
						</svg>
					</div>
					<input
						type='text'
						name='searchQuery'
						value={values.searchQuery}
						onChange={handleChange}
						placeholder='Search for books by title, author, or ISBN...'
						className='block w-full pl-12 pr-4 py-3 border-2 border-gray-600 rounded-md leading-6 bg-white placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-lg font-medium'
						aria-label='Search'
					/>
				</div>
				<button
					type='submit'
					className='ml-3 px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm'
				>
					Search
				</button>
			</form>

			{loading && <p className='text-center'>Loading...</p>}
			{error && <p className='text-red-500 text-center'>{error}</p>}

			{books.length > 0 ? (
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6'>
					{books.map((book) => (
						<div
							key={book.id}
							className='border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow'
						>
							<div className='flex flex-col h-full'>
								<div className='p-4 flex-grow'>
									<div className='flex justify-center mb-4'>
										{book.cover ? (
											<img
												src={book.cover}
												alt={`Cover of ${book.title}`}
												className='h-48 object-contain'
											/>
										) : (
											<div className='h-48 w-32 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400'>
												No cover
											</div>
										)}
									</div>

									<h3 className='text-lg font-semibold mb-1 line-clamp-2'>
										{book.title}
									</h3>

									{book.authors && (
										<p className='text-sm text-gray-600 dark:text-gray-400 mb-2'>
											By {book.authors.join(', ')}
										</p>
									)}

									{book.description && (
										<p className='text-sm text-gray-700 dark:text-gray-300 mb-3 line-clamp-3'>
											{book.description}
										</p>
									)}
								</div>

								<div className='px-4 pb-4 mt-auto'>
									<Link to={`/book/${book.id}`}>
										<button className='text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'>
											View details
										</button>
									</Link>

									{user && (
										<div className='mt-2'>
											<button
												onClick={() => handleAddBook(book)}
												disabled={book.isInLibrary}
												className={`mt-2 px-3 py-1 text-sm rounded ${
													book.isInLibrary
														? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
														: 'bg-blue-600 hover:bg-blue-700 text-white'
												}`}
											>
												{book.isInLibrary
													? '✓ Added to Library'
													: 'Add to Library'}
											</button>
										</div>
									)}
								</div>
							</div>
						</div>
					))}
				</div>
			) : values.searchQuery && !loading ? (
				<p className='text-center text-gray-600 dark:text-gray-400'>
					No books found matching "{values.searchQuery}". Try another search
					term.
				</p>
			) : !values.searchQuery ? (
				<div className='text-center my-12'>
					<p className='text-gray-600 dark:text-gray-400 mb-4'>
						Search for books above to get started.
					</p>
				</div>
			) : null}
		</div>
	);
}
