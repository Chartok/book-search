import { useLazyQuery } from '@apollo/client';
import { useContext } from 'react';
import { SEARCH_BOOKS } from '../utils/queries.js';
import { useForm } from '../utils/hooks.js';
import { AuthContext } from '../context/authContext.js';
import SaveBookBtn from './SaveBookBtn.js';

interface Book {
  bookId: string;
  title: string;
  authors?: string[];
  description?: string;
  image?: string;
  link?: string;
}

export default function SearchBooks() {
  const { user } = useContext(AuthContext);
  const [searchBooks, { data, loading, error }] = useLazyQuery(SEARCH_BOOKS);

  const search = () => {
    searchBooks({ variables: { query: values.search } });
  };

  const { onChange, onSubmit, values } = useForm(search, { search: '' });

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input name="search" value={values.search} onChange={onChange} />
        <button type="submit">Search</button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && (
        <ul>
          {data.searchBooks.map((book: Book) => (
            <li key={book.bookId}>
              <a href={book.link} target="_blank" rel="noreferrer">
                {book.title}
              </a>
              {user && <SaveBookBtn book={book} />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
