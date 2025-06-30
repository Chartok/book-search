import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { sequelize } from './models';
import authRoutes from './routes/auth';
import bookRoutes from './routes/books';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configure CORS to allow requests from the frontend
app.use(
	cors({
		origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Default Vite dev server port
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
		allowedHeaders: ['Content-Type', 'Authorization'],
	})
);

app.use(express.json());

// Root route
app.get('/', (_req, res) => {
	res.json({ message: 'Welcome to the Book Search API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);

sequelize
	.sync({ alter: true }) // Use alter: true to automatically apply model changes
	.then(() => {
		console.log('✅ DB Synced');
		app.listen(PORT, () => {
			console.log(`🚀 Server running on http://localhost:${PORT}`);
		});
	})
	.catch(console.error);
