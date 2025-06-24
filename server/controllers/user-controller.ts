import { Response } from 'express';
import { User, IUser } from '../models';
import { signToken } from '../utils/auth';
import { AuthRequest } from '../utils/auth';

export const userController = {
	async getSingleUser({ user = null, params }: AuthRequest, res: Response) {
		const foundUser = await User.findOne({
			$or: [
				{ _id: user ? user._id : params?.id },
				{ username: params?.username },
			],
		});
		if (!foundUser) {
			return res
				.status(400)
				.json({ message: 'Cannot find a user with this id!' });
		}
		res.json(foundUser);
	},

	async createUser({ body }: AuthRequest, res: Response) {
		const user = await User.create(body);
		if (!user) {
			return res.status(400).json({ message: 'Something is wrong!' });
		}
		const token = signToken(user);
		res.json({ token, user });
	},

	async login({ body }: AuthRequest, res: Response) {
		const user = await User.findOne({
			$or: [{ username: body.username }, { email: body.email }],
		});
		if (!user) {
			return res.status(400).json({ message: "Can't find this user" });
		}
		const correctPw = await (user as IUser).isCorrectPassword(body.password);
		if (!correctPw) {
			return res.status(400).json({ message: 'Wrong password!' });
		}
		const token = signToken(user);
		res.json({ token, user });
	},

	async saveBook({ user, body }: AuthRequest, res: Response) {
		try {
			const updatedUser = await User.findOneAndUpdate(
				{ _id: user._id },
				{ $addToSet: { savedBooks: body } },
				{ new: true, runValidators: true }
			);
			return res.json(updatedUser);
		} catch (err) {
			console.log(err);
			return res.status(400).json(err);
		}
	},

	async deleteBook({ user, params }: AuthRequest, res: Response) {
		const updatedUser = await User.findOneAndUpdate(
			{ _id: user._id },
			{ $pull: { savedBooks: { bookId: params?.bookId } } },
			{ new: true }
		);
		if (!updatedUser) {
			return res
				.status(404)
				.json({ message: "Couldn't find user with this id!" });
		}
		return res.json(updatedUser);
	},
};
