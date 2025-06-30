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

			const saved = await UserSavedBook.create({
				user_id: req.user._id,
				book_id: Number(req.params.id),
			});
			res.json(saved);
		} catch (error) {
			res.status(500).json({ error: 'Failed to save book' });
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
				include: [Book],
			});
			res.json(savedBooks);
		} catch (error) {
			res.status(500).json({ error: 'Failed to fetch saved books' });
		}
	}
);

export default router;
