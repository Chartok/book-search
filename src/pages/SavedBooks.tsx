import { useQuery, useMutation } from '@apollo/client';
import { QUERY_ME } from '../utils/queries.js';
import { REMOVE_BOOK } from '../utils/mutations.js';
import { useContext } from 'react';
import { AuthContext } from '../context/authContext.js';

interface Book {
  bookId: string;
  title: string;
}

export default function SavedBooks() {
  const { user } = useContext(AuthContext);
  const { data, loading, error, refetch } = useQuery(QUERY_ME, {
    variables: { id: user?.id },
    skip: !user,
  });

  const [removeBook] = useMutation(REMOVE_BOOK);

  const handleRemove = async (bookId: string) => {
    await removeBook({ variables: { bookId } });
    refetch();
  };

  if (!user) return <p>Please log in</p>;
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h3>Your Saved Books</h3>
      <ul>
        {data?.user.savedBooks.map((book: Book) => (
          <li key={book.bookId}>
            {book.title}{' '}
            <button onClick={() => handleRemove(book.bookId)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
