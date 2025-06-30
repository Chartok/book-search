import BookCard from './BookCard';
import styles from './BookList.module.css';

interface Book {
	id: string;
	title: string;
	authors?: string[];
	cover?: string;
}

interface Props {
	books: Book[];
}

export default function BookList({ books }: Props) {
	if (!books.length) return <p className={styles.empty}>No results yet…</p>;
	return (
		<ul className={styles.grid}>
			{books.map((b) => (
				<li key={b.id}>
					<BookCard {...b} />
				</li>
			))}
		</ul>
	);
}
