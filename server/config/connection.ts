import mongoose from 'mongoose';

mongoose.connect(
	process.env.MONGODB_URI || 'mongodb://localhost:27017/book-search'
);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
	console.log('MongoDB connected successfully');
});

export default db;
