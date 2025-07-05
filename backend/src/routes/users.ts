import { Router } from 'express';
import { User } from '../models/index.ts';

const router = Router();

// Get all users
router.get('/', async (req, res, next) => {
	try {
		const users = await User.findAll({
			attributes: ['_id', 'username', 'email', 'savedBooks'],
		});
		res.json(users);
	} catch (error) {
		next(error);
	}
});

export default router;
