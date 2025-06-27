import { DataTypes, Model, Sequelize,  InferAttributes, InferCreationAttributes } from 'sequelize';
import bcrypt from 'bcrypt';
import type { Book } from './Book.ts';

const sequelize = new Sequelize(

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
	public id!: number;
	public username!: string;
	public email!: string;
	public password!: string;
	public bookCount!: number;
	public savedBooks!: Book[];

	public async isCorrectPassword(password: string): Promise<boolean> {
		return bcrypt.compare(password, this.password);
	}
}

export function createUserModel(sequelize: Sequelize) {
	User.init({
		id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
		username: { type: DataTypes.STRING, allowNull: false, unique: true },
		email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
		password: { type: DataTypes.STRING, allowNull: false },
		bookCount: { type: DataTypes.INTEGER, defaultValue: 0 },
		savedBooks: {
			type: DataTypes.ARRAY(DataTypes.JSONB),
			defaultValue: [],
			get() {
				const value = this.getDataValue('savedBooks');
				return value ? value : [];
			},
		},
	}, {
		sequelize,
		modelName: 'User',
		timestamps: true,
	});
	User.addHook('beforeCreate', async (user: User) => {
		const saltRounds = 10;
		user.password = await bcrypt.hash(user.password, saltRounds);
	});
	return User;
}
		
	User.prototype.isCorrectPassword = async function(password: string) {
		return bcrypt.compare(password, this.password);
	};
	return User;

