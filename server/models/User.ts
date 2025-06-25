import { DataTypes, Model, Sequelize } from 'sequelize';
import bcrypt from 'bcrypt';
import type { Book } from './Book.ts';

export interface IUser extends Model {
	id: number;
	username: string;
	email: string;
	password: string;
	bookCount: number;
	savedBooks: Book[];
	isCorrectPassword(password: string): Promise<boolean>;
}

export function createUserModel(sequelize: Sequelize) {
	const User = sequelize.define<IUser>('User', {
		username: { type: DataTypes.STRING, allowNull: false, unique: true },
		email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
		password: { type: DataTypes.STRING, allowNull: false },
		savedBooks: { type: DataTypes.JSON },
	}, {
		timestamps: true,
	});
	User.addHook('beforeCreate', async (user: IUser) => {
		const saltRounds = 10;
		user.password = await bcrypt.hash(user.password, saltRounds);
	});
	User.prototype.isCorrectPassword = async function(password: string) {
		return bcrypt.compare(password, this.password);
	};
	return User;
}
