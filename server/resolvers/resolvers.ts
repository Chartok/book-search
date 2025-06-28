import { User } from '../models/User.ts';
import { Book } from '../models/Book.ts';
import { SavedBook } from '../models/SavedBook.ts';
import { UserBook } from '../models/UserBook.ts';
import { authMiddleware, signToken } from '../utils/auth.ts';

export const resolvers = {
	Query: {
		me: async (_, __, { authMiddleware }) => {
			if (!authMiddleware.user) throw new Error('You need to be logged in');
			const user = await User.findByPk(authMiddleware.user._id);
			if (!user) throw new Error('User not found');
			return {
				...user.toJSON(),
			};
		},

		books: async () => {
			return await Book.findAll();
		},

		User: {
			nextBook: (user: UserBook) =>
				user.getBooks({ through: { where: { status: 'NEXT' } } }),
			finishedBook: (user: UserBook) =>
				user.getBooks({ through: { where: { status: 'FINISHED' } } }),
		},
	},

	Mutation: {
		login: async (
			user: User,
			{ username, password }: { username: string; password: string }
		) => {
			const user = await User.findOne({ where: { username } });
			if (!user) throw new Error('User not found');
			const correctPw = await user.isCorrectPassword(password);
			if (!correctPw) throw new Error('Incorrect password');

			const token = signToken({
				_id: user.id,
				username: user.username,
				email: user.email,
			});
			return { token, user };
		},

		register: async (
			user: User,
			args: { username: string; email: string; password: string }
		) => {
			const user = await User.create({ ...args, savedBooks: [] });

			const token = signToken({
				_id: user.id,
				username: user.username,
				email: user.email,
			});
			return { token, user };
		},

		removeBook: async (
			_parent: unknown,
			{ bookId }: { bookId: number },
			context: authMiddleware
		) => {
			if (!context.user)
				throw new Error('You need to be logged in to remove a book');
			// Remove the SavedBook entry for this user and book
			await SavedBook.destroy({
				where: { userId: context.user._id, bookId },
			});
			// Return the updated user
			return await User.findByPk(context.user._id);
		},

		saveBook: async (
			_parent: unknown,
			{ bookId, status }: { bookId: number; status: 'NEXT' | 'FINISHED' },
			context: authMiddleware
		) => {
			if (!context.user)
				throw new Error('You need to be logged in to save a book');
			const [savedBook, created] = await SavedBook.findOrCreate({
				where: { userId: context.user._id, bookId },
				defaults: { status },
			});
			if (!created) {
				// Optionally update status if already exists
				savedBook.status = status;
				await savedBook.save();
			}
			return await User.findByPk(context.user._id);
		},

		updateBookStatus: async (
			_parent: unknown,
			{ bookId, status }: { bookId: number; status: 'NEXT' | 'FINISHED' },
			context: authMiddleware
		) => {
			if (!context.user)
				throw new Error('You need to be logged in to update book status');
			// Find the SavedBook entry for this user and book
			const savedBook = await SavedBook.findOne({
				where: { userId: context.user._id, bookId },
			});
			if (!savedBook) throw new Error('Saved book not found');
			// Update the status
			savedBook.status = status;
			await savedBook.save();
			// Return the updated user
			return await User.findByPk(context.user._id);
		},
	},
};
