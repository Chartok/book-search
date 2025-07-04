import { Router, Request, Response } from 'express';
import { User } from '../models/User.ts';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../utils/token.ts';
import { authMiddleware } from '../middleware/auth.ts';
import { isAuthenticatedRequest } from '../types/auth.ts';
import '../types/index.ts'; // Import type declarations

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
		const payload: JwtPayload = { id: user._id };
		const token = jwt.sign(payload, process.env.JWT_SECRET!, {
			expiresIn: '24h',
		});

		res.status(201).json({
			token,
			user: {
				id: user._id,
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

		 // Check if JWT_SECRET is defined
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined');
      res.status(500).json({ error: 'Server configuration error' });
      return;
    }

		const payload: JwtPayload = { id: user._id };
		const token = jwt.sign(payload, process.env.JWT_SECRET!, {
			expiresIn: '24h',
		});

		res.json({
			token,
			user: {
				id: user._id,
				email: user.email,
				username: user.username,
			},
		});
	} catch (err) {
		console.error('Login error:', err);
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
			id: req.user._id,
			email: req.user.email,
			username: req.user.username,
		});
	}
);

export default router;
