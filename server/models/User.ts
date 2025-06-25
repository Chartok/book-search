import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import bookSchema from './Book.ts';

interface IUser {
	_id: string;
	username: string;
	email: string;
	password: string;
	bookCount: number;
	savedBooks: (typeof bookSchema)[];
}

const userSchema = new Schema<IUser>(
	{
		username: { type: String, required: true, unique: true },
		email: { type: String, required: true, unique: true, match: /.+@.+\..+/ },
		password: {
			type: String,
			required: true,
			match: [
				/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!?._^%$#&*@(){}[\]\s])([A-Za-z\d!?._^%$#&*@(){}[\]\s]{8,})$/,
				'Password must be at least 8 characters and include letters, numbers, and special characters.',
			],
		},
		savedBooks: [bookSchema],
	},
	{
		toJSON: { virtuals: true },
	}
);

userSchema.pre('save', async function (next) {
	if (this.isNew || this.isModified('password')) {
		const saltRounds = 10;
		this.password = await bcrypt.hash(this.password, saltRounds);
	}
	next();
});

userSchema.methods.isCorrectPassword = async function (password: string) {
	return bcrypt.compare(password, this.password);
};

userSchema.virtual('bookCount').get(function () {
	return this.savedBooks.length;
});

const User = model<IUser>('User', userSchema);

export default User;
