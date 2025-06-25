import '../index.css';
import { useMutation, useQuery } from '@apollo/client';
import { REMOVE_BOOK } from '../graphql/mutations';
import { GET_ME } from '../graphql/queries';
// import {
// 	Button,
// 	Card,
// 	CardContent,
// 	Container,
// 	Typography,
// } from '@mui/material';
import { removeBookId } from '../utils/localStorage';

interface Book {
	bookId: string;
	title: string;
	authors: string[];
	description: string;
}

export default function SavedBooks() {
	const { loading, data, refetch } = useQuery(GET_ME);
	const [removeBook] = useMutation(REMOVE_BOOK);

	const handleDeleteBook = async (bookId: string) => {
		try {
			await removeBook({ variables: { bookId } });
			removeBookId(bookId);
			await refetch();
		} catch (err) {
			console.error(err);
		}
	};

	if (loading) return <h2>Loading...</h2>;
	const userData = data?.me || { savedBooks: [] };

	return (
		<div className='container mx-auto mt-4 px-4'>
			<h1 className='text-2xl font-bold mb-4'>Viewing saved books!</h1>
			{userData.savedBooks.length ? (
				userData.savedBooks.map((book: Book) => (
					<div key={book.bookId} className='border rounded p-4 mb-4'>
						<h2 className='text-lg font-semibold'>{book.title}</h2>
						<p className='text-sm mb-2'>Authors: {book.authors.join(', ')}</p>
						<p className='text-sm'>{book.description}</p>
						<button
							className='mt-2 border px-3 py-1 rounded'
							onClick={() => handleDeleteBook(book.bookId)}
						>
							Delete this Book
						</button>
					</div>
				))
			) : (
				<p>You have no saved books!</p>
			)}
		</div>
	);
}
