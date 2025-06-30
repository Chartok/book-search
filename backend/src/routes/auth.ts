import { Router, Request, Response } from 'express';
import { User } from '../models/User';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../utils/token';
import { authMiddleware } from '../middleware/auth';
import { isAuthenticatedRequest } from '../types/auth';
import '../types/index'; // Import type declarations

const router = Router();

router.post('/register', async (req: Request, res: Response): Promise<void> => {
	try {
		// Basic validation
		const { email, password, username } = req.body;
		if (!email || !password || !username) {
			res.status(400).json({
				error: 'Email, password, and username are required',
			});
			return;
		}

		const user = await User.create(req.body);
		const payload: JwtPayload = { id: user.id };
		const token = jwt.sign(payload, process.env.JWT_SECRET!, {
			expiresIn: '24h',
		});

		res.status(201).json({
			token,
			user: {
				id: user.id,
				email: user.email,
				username: user.username,
			},
		});
	} catch (err: any) {
		// Handle duplicate email error
		if (err.name === 'SequelizeUniqueConstraintError') {
			res.status(409).json({ error: 'Email already exists' });
			return;
		}
		res.status(500).json({ error: 'Failed to register user' });
	}
});

router.post('/login', async (req: Request, res: Response): Promise<void> => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			res.status(400).json({
				error: 'Email and password are required',
			});
			return;
		}

		const user = await User.findOne({ where: { email } });
		if (!user || !(await user.isValidPassword(password))) {
			res.status(401).json({ error: 'Invalid credentials' });
			return;
		}

		const payload: JwtPayload = { id: user.id };
		const token = jwt.sign(payload, process.env.JWT_SECRET!, {
			expiresIn: '24h',
		});

		res.json({
			token,
			user: {
				id: user.id,
				email: user.email,
				username: user.username,
			},
		});
	} catch (err) {
		res.status(500).json({ error: 'Login failed' });
	}
});

// Protected route to get current user info
router.get(
	'/me',
	authMiddleware,
	async (req: Request, res: Response): Promise<void> => {
		if (!isAuthenticatedRequest(req)) {
			res.status(401).json({ error: 'Authentication required' });
			return;
		}

		res.json({
			id: req.user.id,
			email: req.user.email,
			username: req.user.username,
		});
	}
);

export default router;
