export interface User {
	id: string;
	email: string;
	username: string;
}

export interface AuthResponse {
	token: string;
	user: User;
}

export interface AuthContextShape {
	user: User | null;
	token: string | null;
	loading: boolean;
	error: string | null;
	login: (email: string, password: string) => Promise<void>;
	register: (
		email: string,
		password: string,
		username: string
	) => Promise<void>;
	logout: () => void;
}

export interface Book {
	id: string;
	title: string;
	authors: string[];
	cover?: string;
	description?: string;
	isbn?: string;
	year?: number;
	isInLibrary?: boolean;
}

export interface SavedBook {
	id: number;
	user_id: string;
	book_id: number;
	shelf: Shelf;
	book: Book;
}

export type Shelf = 'next' | 'finished';

export interface LibraryContextShape {
	shelves: Record<Shelf, Book[]>;
	addBook: (book: Book, shelf: Shelf) => Promise<void>;
	moveBook: (id: string, to: Shelf) => Promise<void>;
	removeBook: (id: string) => Promise<void>;
	loading: boolean;
	error: string | null;
	refreshLibrary: () => Promise<void>;
}
