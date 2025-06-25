import '../index.css';
import { useState, useEffect } from 'react';
// import {
// 	TextField,
// 	Button,
// 	Container,
// 	Typography,
// 	Card,
// 	CardContent,
// } from '@mui/material';
import { useMutation } from '@apollo/client';
import { SAVE_BOOK } from '../graphql/mutations';
import { searchGoogleBooks } from '../utils/API';
import { getSavedBookIds, saveBookIds } from '../utils/localStorage';
import AuthService from '../utils/auth';

interface BookData {
	bookId: string;
	authors: string[];
	title: string;
	description: string;
	image?: string;
	link?: string;
}

export default function HomePage() {
	const [searchedBooks, setSearchedBooks] = useState<BookData[]>([]);
	const [searchInput, setSearchInput] = useState('');
	const [savedBookIds, setSavedBookIds] = useState<string[]>(getSavedBookIds());

	const [saveBook] = useMutation(SAVE_BOOK, {
		update(cache, { data: { saveBook } }) {
			cache.modify({
				id: cache.identify({ __typename: 'User', _id: saveBook._id }),
				fields: {
					savedBooks(existing = []) {
						return [...existing, ...saveBook.savedBooks];
					},
				},
			});
		},
		onError(err) {
			console.error(err);
		},
});

	useEffect(() => {
		return () => saveBookIds(savedBookIds);
	}, [savedBookIds]);

	const handleFormSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!searchInput) return;
		try {
			const response = await searchGoogleBooks(searchInput);
			const items = response.data.items || [];
			interface GoogleBook {
				id: string;
				volumeInfo: {
					authors?: string[];
					title: string;
					description?: string;
					imageLinks?: {
						thumbnail?: string;
					};
					infoLink?: string;
				};
			}
			const bookData: BookData[] = items.map((book: GoogleBook) => ({
				bookId: book.id,
				authors: book.volumeInfo.authors || ['No author to display'],
				title: book.volumeInfo.title,
				description: book.volumeInfo.description || 'No description',
				image: book.volumeInfo.imageLinks?.thumbnail || '',
				link: book.volumeInfo.infoLink,
			}));
			setSearchedBooks(bookData);
			setSearchInput('');
		} catch (err) {
			console.error(err);
		}
	};

	const handleSaveBook = async (bookId: string) => {
		const bookToSave = searchedBooks.find((book) => book.bookId === bookId);
		if (!bookToSave) return;
		const token = AuthService.loggedIn() ? AuthService.getToken() : null;
		if (!token) throw new Error('You need to be logged in to save a book.');
		try {
			await saveBook({ variables: { input: bookToSave } });
			setSavedBookIds([...savedBookIds, bookToSave.bookId]);
		} catch (err) {
			console.error(err);
		}
	};

	return (
                <div className='container mx-auto mt-4 px-4'>
                        <h1 className='text-2xl font-bold mb-4'>Search for Books</h1>
                        <form onSubmit={handleFormSubmit} className='mb-4 flex gap-2'>
                                <input
                                        value={searchInput}
                                        onChange={(e) => setSearchInput(e.target.value)}
                                        placeholder='Search'
                                        className='flex-1 border rounded p-2'
                                />
                                <button type='submit' className='bg-blue-600 text-white px-4 py-2 rounded'>
                                        Search
                                </button>
                        </form>
                        <div className='space-y-4'>
                                {searchedBooks.map((book) => (
                                        <div key={book.bookId} className='border rounded p-4'>
                                                <h2 className='text-lg font-semibold'>{book.title}</h2>
                                                <p className='text-sm mb-2'>Authors: {book.authors.join(', ')}</p>
                                                <p className='text-sm'>{book.description}</p>
                                                {AuthService.loggedIn() && (
                                                        <button
                                                                className='mt-2 border px-3 py-1 rounded'
                                                                disabled={savedBookIds.includes(book.bookId)}
                                                                onClick={() => handleSaveBook(book.bookId)}
                                                        >
                                                                {savedBookIds.includes(book.bookId) ? 'Saved' : 'Save Book'}
                                                        </button>
                                                )}
                                        </div>
                                ))}
                        </div>
                </div>
        )
}
