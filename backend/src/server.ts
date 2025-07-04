import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import './models/index.ts';
import { sequelize } from '../src/db/dbConnection.ts';
import authRoutes from './routes/auth.ts';
import bookRoutes from './routes/books.ts';

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

// Start the server and connect to the database
const startServer = async () => {
	try {
		await sequelize.authenticate();
		console.log('Database connection established successfully.');

		const users = await User.findAll();
		console.log('Users:', users);

		app.listen(PORT, () => {
			console.log(`Server is running on http://localhost:${PORT}`);
		});
	} catch (error) {
		console.error('Unable to connect to the database:', error);
		process.exit(1);
	}
};

startServer();
