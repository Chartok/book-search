import { Router, Request, Response } from 'express';
import axios from 'axios';
import { Book } from '../models/Book.ts';
import { UserSavedBook } from '../models/SavedBook.ts';
import { Op } from 'sequelize';
import { authMiddleware } from '../middleware/auth.ts';
import '../types/index.ts'; // Import type declarations

const router = Router();
const GOOGLE_BOOKS_API_KEY = process.env.GOOGLE_BOOKS_API_KEY;
const GOOGLE_BOOKS_API_URL = 'https://www.googleapis.com/books/v1/volumes';

// Public route - search books
router.get('/search', async (req: Request, res: Response): Promise<void> => {
	try {
		const { query = '', page = '1', limit = '10' } = req.query;

		const pageNum = parseInt(page as string, 10);
		const limitNum = parseInt(limit as string, 10);
		const startIndex = (pageNum - 1) * limitNum;

		// Search in Google Books API
		const response = await axios.get(`${GOOGLE_BOOKS_API_URL}`, {
			params: {
				q: query,
				startIndex,
				maxResults: limitNum,
				key: GOOGLE_BOOKS_API_KEY,
			},
		});

		const { items = [], totalItems = 0 } = response.data;

		// Format the response to match frontend expectations
		const books = items.map((item: any) => {
			const volumeInfo = item.volumeInfo || {};
			return {
				id: item.id,
				title: volumeInfo.title || 'Unknown Title',
				authors: volumeInfo.authors || [],
				description: volumeInfo.description || '',
				cover: volumeInfo.imageLinks?.thumbnail || '',
				link: item.selfLink || '',
			};
		});

		res.json({
			books,
			total: totalItems,
			page: pageNum,
			limit: limitNum,
		});
	} catch (error) {
		console.error('Search error:', error);
		// Provide more detailed error information
		if (axios.isAxiosError(error)) {
			console.error('Google Books API error:', error.response?.data);

			if (error.response?.status === 401 || error.response?.status === 403) {
				res.status(500).json({
					error: 'API key error. Please check your Google Books API key.',
				});
			} else {
				res.status(500).json({
					error: 'Failed to search books',
					details: error.response?.data || error.message,
				});
			}
		} else {
			res.status(500).json({ error: 'Failed to search books' });
		}
	}
});

// Public route - get book by ID
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
	try {
		// First check if the book exists in our database
		let book = await Book.findByPk(req.params.id);

		// If not found in our database, try to fetch from Google Books API
		if (!book) {
			const response = await axios.get(
				`${GOOGLE_BOOKS_API_URL}/${req.params.id}`,
				{
					params: {
						key: GOOGLE_BOOKS_API_KEY,
					},
				}
			);

			const item = response.data;
			if (item) {
				const volumeInfo = item.volumeInfo || {};

				// Format the response to match frontend expectations
				const bookData = {
					id: item.id,
					title: volumeInfo.title || 'Unknown Title',
					authors: volumeInfo.authors || [],
					description: volumeInfo.description || '',
					cover: volumeInfo.imageLinks?.thumbnail || '',
					link: item.selfLink || '',
					categories: volumeInfo.categories || [],
					publisher: volumeInfo.publisher || '',
					publishedDate: volumeInfo.publishedDate || '',
					pageCount: volumeInfo.pageCount || 0,
					language: volumeInfo.language || '',
					previewLink: volumeInfo.previewLink || '',
					infoLink: volumeInfo.infoLink || '',
				};

				// Only save to database if needed
				book = await Book.create({
					bookId: item.id,
					title: volumeInfo.title || 'Unknown Title',
					authors: Array.isArray(volumeInfo.authors)
						? JSON.stringify(volumeInfo.authors)
						: JSON.stringify([]),
					description: volumeInfo.description || '',
					cover: volumeInfo.imageLinks?.thumbnail || '',
					link: item.selfLink || '',
					nextBook: null,
					finishedBook: null,
					userId: null,
				});

				res.json(bookData);
				return;
			} else {
				res.status(404).json({ error: 'Book not found' });
				return;
			}
		}

		// If found in database, format the response
		res.json({
			id: book.bookId.toString(),
			title: book.title,
			authors: Array.isArray(book.authors)
				? book.authors
				: JSON.parse(book.authors || '[]'),
			description: book.description,
			cover: book.cover,
			link: book.link,
		});
	} catch (error) {
		console.error('Error fetching book:', error);
		res.status(500).json({ error: 'Failed to fetch book' });
	}
});

// Protected route - save a book for user
router.post(
	'/:id/save',
	authMiddleware,
	async (req: Request, res: Response): Promise<void> => {
		try {
			if (!req.user) {
				res.status(401).json({ error: 'User not authenticated' });
				return;
			}

			const { shelf = 'next' } = req.body;

			// Check if book already exists in user's library
			const existing = await UserSavedBook.findOne({
				where: {
					user_id: req.user._id,
					book_id: Number(req.params.id),
				},
			});

			if (existing) {
				// Update the shelf if it's different
				if (existing.shelf !== shelf) {
					existing.shelf = shelf;
					await existing.save();
				}
				res.json(existing);
				return;
			}

			const saved = await UserSavedBook.create({
				user_id: req.user._id,
				book_id: Number(req.params.id),
				shelf,
			});

			res.status(201).json(saved);
		} catch (error) {
			console.error('Save book error:', error);
			res.status(500).json({ error: 'Failed to save book' });
		}
	}
);

// Protected route - update book shelf
router.put(
	'/:id/shelf',
	authMiddleware,
	async (req: Request, res: Response): Promise<void> => {
		try {
			if (!req.user) {
				res.status(401).json({ error: 'User not authenticated' });
				return;
			}

			const { shelf } = req.body;

			if (!shelf || !['next', 'finished'].includes(shelf)) {
				res
					.status(400)
					.json({ error: 'Valid shelf is required (next or finished)' });
				return;
			}

			const saved = await UserSavedBook.findOne({
				where: {
					user_id: req.user._id,
					book_id: Number(req.params.id),
				},
			});

			if (!saved) {
				res.status(404).json({ error: 'Saved book not found' });
				return;
			}

			saved.shelf = shelf;
			await saved.save();

			res.json(saved);
		} catch (error) {
			console.error('Update shelf error:', error);
			res.status(500).json({ error: 'Failed to update book shelf' });
		}
	}
);

// Protected route - remove a saved book
router.delete(
	'/:id/remove',
	authMiddleware,
	async (req: Request, res: Response): Promise<void> => {
		try {
			if (!req.user) {
				res.status(401).json({ error: 'User not authenticated' });
				return;
			}

			const deleted = await UserSavedBook.destroy({
				where: {
					user_id: req.user._id,
					book_id: Number(req.params.id),
				},
			});

			if (deleted === 0) {
				res.status(404).json({ error: 'Saved book not found' });
				return;
			}

			res.json({ message: 'Book removed from saved list' });
		} catch (error) {
			res.status(500).json({ error: 'Failed to remove book' });
		}
	}
);

// Protected route - get user's saved books
router.get(
	'/saved',
	authMiddleware,
	async (req: Request, res: Response): Promise<void> => {
		try {
			if (!req.user) {
				res.status(401).json({ error: 'User not authenticated' });
				return;
			}

			const savedBooks = await UserSavedBook.findAll({
				where: { user_id: req.user._id },
				include: [
					{
						model: Book,
						required: true,
					},
				],
				order: [['book_id', 'ASC']],
			});

			// Format the response to match the frontend expectations
			const formattedBooks = savedBooks.map((savedBook) => {
				const book = savedBook.get('book') as Book;
				return {
					...savedBook.get(),
					book: {
						id: book.bookId.toString(),
						title: book.title,
						authors: Array.isArray(book.authors)
							? book.authors
							: JSON.parse(book.authors),
						description: book.description,
						cover: book.cover,
					},
				};
			});

			res.json(formattedBooks);
		} catch (error) {
			console.error('Error fetching saved books:', error);
			res.status(500).json({ error: 'Failed to fetch saved books' });
		}
	}
);

export default router;
