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

	const handleSearch = async (e: React.FormEvent) => {
		e.preventDefault();
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

	// Helper function to render book cards
	const renderBookCard = (book: Book, actions: React.ReactNode) => (
		<div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
			<div className="flex p-4">
				{book.cover ? (
					<img src={book.cover} alt={book.title} className="w-20 h-28 object-cover rounded" />
				) : (
					<div className="w-20 h-28 bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded">
						<span className="text-gray-500 dark:text-gray-400">No cover</span>
					</div>
				)}
				<div className="ml-4 flex flex-col">
					<h3 className="font-semibold text-lg">{book.title}</h3>
					{book.authors && <p className="text-gray-600 dark:text-gray-400 text-sm">{book.authors.join(', ')}</p>}
					{actions}
				</div>
			</div>
		</div>
	);

	return (
		<div className="max-w-4xl mx-auto">
			<h1 className="text-2xl md:text-3xl font-bold text-center mb-6">Your library</h1>
			
			<div className="mb-8">
				<h2 className="text-xl font-semibold mb-4">Add more books</h2>
				
				{/* Search Bar */}
				<form 
					className="flex w-full max-w-md mx-auto mb-6" 
					onSubmit={handleSearch}
				>
					<input
						type="text"
						placeholder="Search for books…"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
					/>
					<button 
						type="submit"
						className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md"
					>
						Search
					</button>
				</form>

				{searching && <p className="text-center">Searching...</p>}
				{searchError && <p className="text-red-500 text-center">{searchError}</p>}

				{/* Search Results */}
				{searchResults.length > 0 ? (
					<ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-4">
						{searchResults.map((book) => (
							<li key={book.id}>
								{renderBookCard(
									book,
									<button
										onClick={() => handleAddBook(book)}
										className="mt-2 px-3 py-1 text-sm rounded bg-blue-600 hover:bg-blue-700 text-white"
									>
										Save as "next"
									</button>
								)}
							</li>
						))}
					</ul>
				) : (
					query && !searching && <p className="text-center text-gray-600 dark:text-gray-400">No new books found for "{query}"</p>
				)}
			</div>

			{libraryLoading && <p className="text-center">Loading your library...</p>}
			{libraryError && <p className="text-red-500 text-center">{libraryError}</p>}

			{/* Next Up Section */}
			<div className="mb-8">
				<h2 className="text-xl font-semibold mb-4">
					Next up {shelves.next.length > 0 && `(${shelves.next.length})`}
				</h2>
				
				{shelves.next.length > 0 ? (
					<ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-4">
						{shelves.next.map((book) => (
							<li key={book.id}>
								{renderBookCard(
									book,
									<div className="flex gap-2 mt-2">
										<button
											onClick={() => moveBook(book.id, 'finished')}
											className="px-3 py-1 text-sm rounded bg-green-600 hover:bg-green-700 text-white"
										>
											Mark finished
										</button>
										<button
											onClick={() => removeBook(book.id)}
											className="px-3 py-1 text-sm rounded bg-red-600 hover:bg-red-700 text-white"
										>
											Remove
										</button>
									</div>
								)}
							</li>
						))}
					</ul>
				) : (
					<p className="text-center text-gray-600 dark:text-gray-400">You don't have any books in your "Next up" list yet.</p>
				)}
			</div>

			{/* Finished Section */}
			<div className="mb-8">
				<h2 className="text-xl font-semibold mb-4">
					Finished {shelves.finished.length > 0 && `(${shelves.finished.length})`}
				</h2>
				
				{shelves.finished.length > 0 ? (
					<ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-4">
						{shelves.finished.map((book) => (
							<li key={book.id}>
								{renderBookCard(
									book,
									<button
										onClick={() => removeBook(book.id)}
										className="mt-2 px-3 py-1 text-sm rounded bg-red-600 hover:bg-red-700 text-white"
									>
										Remove
									</button>
								)}
							</li>
						))}
					</ul>
				) : (
					<p className="text-center text-gray-600 dark:text-gray-400">You haven't finished any books yet.</p>
				)}
			</div>
		</div>
	);
}

