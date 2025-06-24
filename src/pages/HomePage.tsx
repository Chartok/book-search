import { useState, useEffect } from 'react';
import {
	TextField,
	Button,
	Container,
	Typography,
	Card,
	CardContent,
} from '@mui/material';
import { useMutation } from '@apollo/client';
import { SAVE_BOOK } from '../graphql/mutations';
import { searchGoogleBooks } from '../utils/API';
import { getSavedBookIds, saveBookIds } from '../utils/localStorage';
import Auth from '../utils/auth';

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

	const [saveBook] = useMutation(SAVE_BOOK);

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
		const token = Auth.loggedIn() ? Auth.getToken() : null;
		if (!token) return;
		try {
			await saveBook({ variables: { input: bookToSave } });
			setSavedBookIds([...savedBookIds, bookToSave.bookId]);
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<Container sx={{ mt: 4 }}>
			<Typography variant='h4' gutterBottom>
				Search for Books
			</Typography>
			<form onSubmit={handleFormSubmit} style={{ marginBottom: '1rem' }}>
				<TextField
					value={searchInput}
					onChange={(e) => setSearchInput(e.target.value)}
					label='Search'
				/>
				<Button type='submit' variant='contained' sx={{ ml: 2 }}>
					Search
				</Button>
			</form>
			<div>
				{searchedBooks.map((book) => (
					<Card key={book.bookId} sx={{ mb: 2 }}>
						<CardContent>
							<Typography variant='h6'>{book.title}</Typography>
							<Typography variant='body2'>
								Authors: {book.authors.join(', ')}
							</Typography>
							<Typography variant='body2'>{book.description}</Typography>
							{Auth.loggedIn() && (
								<Button
									variant='outlined'
									sx={{ mt: 1 }}
									disabled={savedBookIds.includes(book.bookId)}
									onClick={() => handleSaveBook(book.bookId)}
								>
									{savedBookIds.includes(book.bookId) ? 'Saved' : 'Save Book'}
								</Button>
							)}
						</CardContent>
					</Card>
				))}
			</div>
		</Container>
	);
}
