import { Router, Request, Response } from 'express';
import { Book } from '../models/Book';
import { UserSavedBook } from '../models/SavedBook';
import { authMiddleware } from '../middleware/auth';
import '../types/index'; // Import type declarations

const router = Router();

// Public route - get all books
router.get('/', async (_req: Request, res: Response): Promise<void> => {
	try {
		const books = await Book.findAll();
		res.json(books);
	} catch (error) {
		res.status(500).json({ error: 'Failed to fetch books' });
	}
});

// Public route - search books
router.get('/search', async (req: Request, res: Response): Promise<void> => {
	try {
		const { query, page = '1', limit = '10' } = req.query;

		if (!query) {
			res.status(400).json({ error: 'Search query is required' });
			return;
		}

		const pageNum = parseInt(page as string, 10);
		const limitNum = parseInt(limit as string, 10);
		const offset = (pageNum - 1) * limitNum;

		const { rows: books, count: total } = await Book.findAndCountAll({
			where: {
				title: {
					[Book.getSearchOperator()]: `%${query}%`,
				},
			},
			limit: limitNum,
			offset: offset,
			order: [['title', 'ASC']],
		});

		res.json({
			books,
			total,
			page: pageNum,
			limit: limitNum,
		});
	} catch (error) {
		console.error('Search error:', error);
		res.status(500).json({ error: 'Failed to search books' });
	}
});

// Public route - get book by ID
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
	try {
		const book = await Book.findByPk(req.params.id);

		if (!book) {
			res.status(404).json({ error: 'Book not found' });
			return;
		}

		res.json(book);
	} catch (error) {
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
						cover: book.image,
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
