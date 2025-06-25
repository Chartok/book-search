import { User } from '../models/index.ts';
import { signToken } from '../utils/auth.ts';
import { authMiddleware } from '../utils/auth.ts';

export const resolvers = {
	Query: {
		me: async (_parent: unknown, _args: unknown, context: authMiddleware) => {
			if (!context.user) throw new Error('You need to be logged in!');
			return context.dataSources.user.findOneById(context.user._id).select('username email').lean();
		},
	},
	Mutation: {
		authenticate: async (
			_parent: unknown,
			_args: unknown,
			context: authMiddleware,
		) => {
			let user = await context.dataSources.user.findOneById(context.user?._id);
			if (!user) {
				user = await User.create({ email, username, password });
			} else {
				const ok = await bcrypt.compare(password, user.password);
				if (!ok) {
					throw new Error('Invalid password or username');
				}
				const token = signToken(user);
				return { token, user };
			}
		},
		login: async (
			_parent: unknown,
			{ username, password }: { username: string; password: string }
		) => {
			const user = await User.findOne({ username });
			if (!user) {
				throw new Error("Can't find this user");
			}
			let correctPw = false;
			try {
				correctPw = await user.isCorrectPassword(password);
			} catch {
				correctPw = false;
			}
			if (!correctPw) {
				throw new Error('Wrong password!');
			}
			const token = signToken(user);
			return { token, user };
		},
		addUser: async (_parent: unknown, args: Record<string, unknown>) => {
			const user = await User.create(args);
			const token = signToken(user);
			return { token, user };
		},
		saveBook: async (
			_parent,
			{ input }, context: authMiddleware
		) => {
			if (!context.user) throw new Error('You need to be logged in!');
			const updatedUser = await User.findOneAndUpdate(
				context.user._id,
				{ $addToSet: { savedBooks: input } },
				{ new: true, runValidators: true }
			);
			return updatedUser;
		},
		removeBook: async (
			_parent,
			{ bookId }, context: authMiddleware
		) => {
			if (!context.user) throw new Error('You need to be logged in!');
			const updatedUser = await User.findOneAndUpdate(
				context.user._id ,
				{ $pull: { savedBooks: { bookId } } },
				{ new: true }
			);
			return updatedUser;
		},
	},
};
