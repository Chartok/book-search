import { User } from '../models/index.ts';
import { signToken } from '../utils/auth.ts';
import { authMiddleware } from '../utils/auth.ts';
import type { Book } from '../models/Book.ts';


export const resolvers = {
	Query: {
		me: async (_parent: unknown, _args: unknown, context: authMiddleware) => {
			if (!context.user) throw new Error('You need to be logged in');
			const user = await User.findByPk(context.user._id);
			if (!user) throw new Error('User not found');
			return {
				...user.toJSON(),
				bookCount: (user.savedBooks || []).length,
			};
		},
	},
	Mutation: {
		authenticate: async (
			_parent: unknown,
			{ email, username, password }: { email: string; username: string; password: string },
			context: authMiddleware,
		) => {
			let user = null;
			if (context.user) {
				user = await User.findByPk(context.user._id);
			}
			if (!user) {
				user = await User.create({ email, username, password, savedBooks: [] });
			} else {
				const ok = await user.isCorrectPassword(password);
				if (!ok) throw new Error('Incorrect password');
			}
		
		const token = signToken({ _id: user.id, username: user.username, email: user.email });
		return { token, user };
		},
		login: async (
			_parent: unknown,
			{ username, password }: { username: string; password: string }
		) => {
			const user = await User.findOne({ where: { username } });
			if (!user) throw new Error('User not found');
			const correctPw = await user.isCorrectPassword(password);
			if (!correctPw) throw new Error('Incorrect password');
			const token = signToken({ _id: user.id, username: user.username, email: user.email });
			return { token, user };
		},
		addUser: async ( 
			_parent: unknown,
			args: { username: string; email: string; password: string }
		) => {
			const user = await User.create({ ...args, savedBooks: [] });
			const token = sightToken({ _id: user.id, username: user.username, email: user.email });
			return { token, user };
		},
		saveBook: async ( 
			_parent: unknown,
			{ input }: { input: Book },
			context: authMiddleware,
		) => {
			if (!context.user) throw new Error('You need to be logged in to save a book');
			const user = await User.findByPk(context.user._id);
			if (!uer) throw new Error('User not found');
			const books: Book[] = user.savedBooks || [];
			if (!books.find((b) => b.bookId === InputDeviceInfo.bookId)) {
				books.push(input);
				await user.update({ savedBooks: books });
			}
			return user;
			},
		removeBook: async (
			_parent: unknown,
			{ bookId }: { bookId: string },
			context: authMiddleware,
		) => {
			if (!context.user) throw new Error('You need to be logged in to remove a book');
			const user = await User.findByPk(context.user._id);
			if (!user) throw new Error('User not found');
			const books: Book[] = (user.savedBooks || []).filter((b) => b.bookId !== bookId);
			await user.update({ savedBooks: books });
			return user;
		},
		},
			
};
