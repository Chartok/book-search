import { DataTypes, Model } from 'sequelize';
import bcrypt from 'bcrypt';
import { sequelize } from './index';
import { UserSavedBook } from './SavedBook';

export class User extends Model {
	public _id!: number;
	public username!: string;
	public email!: string;
	public password!: string;
	public bookCount!: number;
	public savedBooks!: UserSavedBook[];
	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;

	public async isValidPassword(password: string): Promise<boolean> {
		return await bcrypt.compare(password, this.password);
	}
}

User.init(
	{
		_id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			field: '_id',
		},
		username: { type: DataTypes.STRING, allowNull: false, unique: true },
		email: { type: DataTypes.STRING, allowNull: false, unique: true },
		password: { type: DataTypes.STRING, allowNull: false },
		bookCount: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			field: 'book_count',
		},
		savedBooks: {
			type: DataTypes.JSON,
			allowNull: true,
			field: 'saved_books',
		},
	},
	{
		sequelize,
		modelName: 'user',
		tableName: 'users',
		timestamps: true,
		underscored: true, // This tells Sequelize that the DB columns use snake_case
		createdAt: 'created_at', // Map camelCase to snake_case
		updatedAt: 'updated_at', // Map camelCase to snake_case
		hooks: {
			beforeCreate: async (user: User) => {
				user.password = await bcrypt.hash(user.password, 10);
			},
			beforeUpdate: async (user: User) => {
				// Only hash the password if it has been changed
				if (user.changed('password')) {
					user.password = await bcrypt.hash(user.password, 10);
				}
			},
		},
	}
);
