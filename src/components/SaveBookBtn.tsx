import { useMutation } from '@apollo/client';
import { SAVE_BOOK } from '../utils/mutations.js';

interface Book {
  bookId: string;
  title: string;
  authors?: string[];
  description?: string;
  image?: string;
  link?: string;
}

export default function SaveBookBtn({ book }: { book: Book }) {
  const [saveBook, { loading }] = useMutation(SAVE_BOOK, {
    variables: { book },
    refetchQueries: ['user'],
  });

  return (
    <button onClick={() => saveBook()} disabled={loading}>
      {loading ? 'Saving...' : 'Save Book'}
    </button>
  );
}
