import { useState } from 'react';
import SearchBar from './components/SearchBar';
import BookList from './components/BookList';
import styles from './App.module.css';

function App() {
  const [query, setQuery] = useState('');
  // TODO: hook your API call here
  return (
    <main className={styles.container}>
      <h1>Book Search</h1>
      <SearchBar value={query} onChange={setQuery} onSubmit={() => { /* search */ }} />
      <BookList books={[]} />
    </main>
  );
}

export default App;
