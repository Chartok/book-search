import { DataTypes, Model } from 'sequelize';
import { sequelize } from './index';
import { User } from './User';
import { Book } from './Book';

export class UserSavedBook extends Model {
	public user_saved_book_id!: number;
	public user_id!: number;
	public book_id!: number;
	public shelf!: 'next' | 'finished';
}

UserSavedBook.init(
	{
		user_saved_book_id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			field: 'user_saved_book_id',
		},
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'users',
				key: '_id',
			},
		},
		book_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'books',
				key: 'bookId',
			},
		},
		shelf: {
			type: DataTypes.ENUM('next', 'finished'),
			allowNull: false,
			defaultValue: 'next',
		},
	},
	{
		sequelize,
		modelName: 'user_saved_book',
		tableName: 'user_saved_books',
		timestamps: false,
	}
);

User.hasMany(UserSavedBook, {
	foreignKey: 'user_id',
	sourceKey: '_id',
});

Book.hasMany(UserSavedBook, {
	foreignKey: 'book_id',
	sourceKey: 'bookId',
});

UserSavedBook.belongsTo(User, {
	foreignKey: 'user_id',
	targetKey: '_id',
});

UserSavedBook.belongsTo(Book, {
	foreignKey: 'book_id',
	targetKey: 'bookId',
});
