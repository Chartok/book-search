import { DataTypes, Model } from 'sequelize';
import { sequelize } from './index';
import { User } from './User';
import { Book } from './Book';

export class SavedBook extends Model {
	public id!: number;
	public status!: 'NEXT' | 'FINISHED';
	public userId!: number;
	public bookId!: number;
}

SavedBook.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		status: { type: DataTypes.ENUM('NEXT', 'FINISHED'), allowNull: false },
		userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
		bookId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
	},
	{
		sequelize,
		modelName: 'savedBook',
	}
);

User.hasMany(SavedBook);
Book.hasMany(SavedBook);
SavedBook.belongsTo(User);
SavedBook.belongsTo(Book);
