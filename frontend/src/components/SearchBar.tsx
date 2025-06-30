import Button from './Button';
import Input from './Input';
import styles from './SearchBar.module.css';

interface Props {
	value: string;
	onChange: (val: string) => void;
	onSubmit: () => void;
}

export default function SearchBar({ value, onChange, onSubmit }: Props) {
	return (
		<form
			className={styles.bar}
			onSubmit={(e) => {
				e.preventDefault();
				onSubmit();
			}}
		>
			<Input
				placeholder='Search for books…'
				value={value}
				onChange={(e) => onChange(e.target.value)}
			/>
			<Button type='submit'>Search</Button>
		</form>
	);
}
