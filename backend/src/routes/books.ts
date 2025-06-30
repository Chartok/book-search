import { Router } from 'express';
import { Book } from '../models/Book';
import { SavedBook } from '../models/SavedBook';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', async (_, res) => {
	const books = await Book.findAll();
	res.json(books);
});

router.post('/:id/save', authMiddleware, async (req, res) => {
	const saved = await SavedBook.create({
		userId: req.user.id,
		bookId: Number(req.params.id),
		status: req.body.status,
	});
	res.json(saved);
});

router.delete('/:id/remove', authMiddleware, async (req, res) => {
	await SavedBook.destroy({
		where: { userId: req.user.id, bookId: Number(req.params.id) },
	});
	res.json({ message: 'Removed' });
});

export default router;
