import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import type { Book } from '../context/types';

interface BookListProps {
	books: (Book & { component?: ReactNode })[];
}

export default function BookList({ books }: BookListProps) {
	if (!books.length) {
		return <p className='text-center text-gray-600'>No books found.</p>;
	}

	return (
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

							{/* Categories would go here if they existed in the Book type */}
							{/* 
							<div className='flex flex-wrap gap-2 mt-2 mb-3'>
								{book.categories?.map((category, index) => (
									<span
										key={index}
										className='text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded'
									>
										{category}
									</span>
								))}
							</div>
							*/}
						</div>

						<div className='px-4 pb-4 mt-auto'>
							<Link to={`/book/${book.id}`}>
								<button className='text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'>
									View details
								</button>
							</Link>

							{book.component && <div className='mt-2'>{book.component}</div>}
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
