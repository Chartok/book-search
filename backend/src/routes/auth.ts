import { Router } from 'express';
import { User } from '../models/User';
import jwt from 'jsonwebtoken';

const router = Router();

router.post('/register', async (req, res) => {
	try {
		const user = await User.create(req.body);
		const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!);
		res.json({ token });
	} catch (err) {
		res.status(500).json({ error: 'Failed to register user' });
	}
});

router.post('/login', async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ where: { email } });
	if (!user || !(await user.isValidPassword(password))) {
		return res.status(401).json({ error: 'Invalid credentials' });
	}
	const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!);
	res.json({ token });
});

export default router;
