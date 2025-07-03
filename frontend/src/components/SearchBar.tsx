import { useState, useEffect } from 'react';
import type { FormEvent, ChangeEvent } from 'react';

interface SearchBarProps {
	value: string;
	onChange: (value: string) => void;
	onSubmit: (e: FormEvent) => void;
	placeholder?: string;
	className?: string;
}

export default function SearchBar({
	value,
	onChange,
	onSubmit,
	placeholder = 'Search for books by title, author, or ISBN...',
	className = '',
}: SearchBarProps) {
	const [inputValue, setInputValue] = useState(value);

	// Sync local state with parent state
	useEffect(() => {
		setInputValue(value);
	}, [value]);

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.value;
		setInputValue(newValue);
		onChange(newValue);
	};

	return (
		<form onSubmit={onSubmit} className={`flex w-full mb-6 ${className}`}>
			<div className='relative flex-grow'>
				<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
					<svg
						className='w-6 h-6 text-gray-600'
						fill='currentColor'
						viewBox='0 0 20 20'
					>
						<path
							fillRule='evenodd'
							d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z'
							clipRule='evenodd'
						/>
					</svg>
				</div>
				<input
					type='text'
					value={inputValue}
					onChange={handleChange}
					placeholder={placeholder}
					className='block w-full pl-12 pr-4 py-3 border-2 border-gray-600 rounded-md leading-6 bg-white placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-lg font-medium'
					aria-label='Search'
				/>
			</div>
			<button
				type='submit'
				className='ml-3 px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm'
			>
				Search
			</button>
		</form>
	);
}
