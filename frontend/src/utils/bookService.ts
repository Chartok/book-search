import api from './api';
import type { Book, SavedBook, Shelf } from '../context/types';

export interface SearchResponse {
	books: Book[];
	total: number;
}

export const BookService = {
	/**
	 * Search for books using the public API endpoint
	 */
	search: async (
		query: string,
		page = 1,
		limit = 10
	): Promise<SearchResponse> => {
		try {
			const response = await api.get('/books/search', {
				params: { query, page, limit },
			});
			return response.data;
		} catch (error) {
			console.error('Book search error:', error);
			throw error;
		}
	},

	/**
	 * Get book details by ID
	 */
	getBookById: async (id: string): Promise<Book> => {
		try {
			const response = await api.get(`/books/${id}`);
			return response.data;
		} catch (error) {
			console.error('Get book error:', error);
			throw error;
		}
	},

	/**
	 * Get all saved books for the current user
	 */
	getSavedBooks: async (): Promise<SavedBook[]> => {
		try {
			const response = await api.get('/books/saved');
			return response.data;
		} catch (error) {
			console.error('Get saved books error:', error);
			throw error;
		}
	},

	/**
	 * Save a book to the user's library
	 */
	saveBook: async (bookId: string, shelf: Shelf): Promise<SavedBook> => {
		try {
			const response = await api.post(`/books/${bookId}/save`, { shelf });
			return response.data;
		} catch (error) {
			console.error('Save book error:', error);
			throw error;
		}
	},

	/**
	 * Update a book's shelf
	 */
	updateBookShelf: async (bookId: string, shelf: Shelf): Promise<SavedBook> => {
		try {
			const response = await api.put(`/books/${bookId}/shelf`, { shelf });
			return response.data;
		} catch (error) {
			console.error('Update book shelf error:', error);
			throw error;
		}
	},

	/**
	 * Remove a book from the user's library
	 */
	removeBook: async (bookId: string): Promise<void> => {
		try {
			await api.delete(`/books/${bookId}/remove`);
		} catch (error) {
			console.error('Remove book error:', error);
			throw error;
		}
	},
};

export default BookService;
