import mongoose from 'mongoose';

mongoose.connect(
	process.env.MONGODB_URI || 'mongodb://localhost:27017/book-search',
	console.log('MongoDB connected successfully')
);

export default mongoose.connection;
