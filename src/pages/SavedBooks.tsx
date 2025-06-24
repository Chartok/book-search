import { useMutation, useQuery } from '@apollo/client';
import { REMOVE_BOOK } from '../graphql/mutations';
import { GET_ME } from '../graphql/queries';
import {
	Button,
	Card,
	CardContent,
	Container,
	Typography,
} from '@mui/material';
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
		<Container sx={{ mt: 4 }}>
			<Typography variant='h4' gutterBottom>
				Viewing saved books!
			</Typography>
			{userData.savedBooks.length ? (
				userData.savedBooks.map((book: Book) => (
					<Card key={book.bookId} sx={{ mb: 2 }}>
						<CardContent>
							<Typography variant='h6'>{book.title}</Typography>
							<Typography variant='body2'>
								Authors: {book.authors.join(', ')}
							</Typography>
							<Typography variant='body2'>{book.description}</Typography>
							<Button
								variant='outlined'
								sx={{ mt: 1 }}
								onClick={() => handleDeleteBook(book.bookId)}
							>
								Delete this Book
							</Button>
						</CardContent>
					</Card>
				))
			) : (
				<Typography>You have no saved books!</Typography>
			)}
		</Container>
	);
}
