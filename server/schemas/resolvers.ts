import { User } from '../models';
import { signToken } from '../utils/auth';
import { GraphQLContext } from '../utils/serverauth';

export const resolvers = {
	Query: {
		me: async (_parent: unknown, _args: unknown, context: GraphQLContext) => {
			if (!context.user) throw new Error('You need to be logged in!'); 
			return User.findById(context.user._id).select('username email').lean();
			}
				
	},
	Mutation: {
		login: async (
			_id: string,
			{ username, password }: { username: string; password: string }
		) => {
			const user = await User.findOne({ username });
			if (!user) {
				throw new Error("Can't find this user");
			}
			const correctPw = await user.isCorrectPassword(password);
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
			_parent: unknown,
			{ input }: { input: Record<string, unknown> },
			context: AuthRequest
		) => {
			if (!context.user) throw new Error('You need to be logged in!');
			const updatedUser = await User.findOneAndUpdate(
				{ _id: context.user._id },
				{ $addToSet: { savedBooks: input } },
				{ new: true, runValidators: true }
			);
			return updatedUser;
		},
		removeBook: async (
			_parent: unknown,
			{ bookId }: { bookId: string },
			context: AuthRequest
		) => {
			if (!context.user) throw new Error('You need to be logged in!');
			const updatedUser = await User.findOneAndUpdate(
				{ _id: context.user._id },
				{ $pull: { savedBooks: { bookId } } },
				{ new: true }
			);
			return updatedUser;
		},
	},
};
