import Card from './Card';
import styles from './BookCard.module.css';

interface Book {
	id: string;
	title: string;
	authors?: string[];
	cover?: string;
}

export default function BookCard({ title, authors, cover }: Book) {
	return (
		<Card>
			<div className={styles.row}>
				{cover && <img src={cover} alt={title} className={styles.cover} />}
				<div>
					<h3>{title}</h3>
					{authors && <p>{authors.join(', ')}</p>}
				</div>
			</div>
		</Card>
	);
}
