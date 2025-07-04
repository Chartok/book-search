import { DataTypes, Model, Op } from 'sequelize';
import { sequelize } from '../../db/db';

export class Book extends Model {
	public bookId!: number;
	public authors!: string; // JSON array as string
	public title!: string;
	public description!: string;
	public cover!: string;
	public link!: string;
	public nextBook!: boolean | null;
	public finishedBook!: boolean | null;
	public userId!: number | null;

	// Static methods for search functionality
	public static getSearchColumnName() {
		return 'title'; // We'll search by title
	}

	public static getSearchOperator() {
		return Op.like; // Use LIKE operator for case-insensitive search
	}
}

Book.init(
	{
		bookId: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			field: 'bookId',
		},
		authors: { type: DataTypes.JSON, allowNull: false },
		title: { type: DataTypes.STRING, allowNull: false },
		description: { type: DataTypes.STRING, allowNull: false },
		cover: { type: DataTypes.STRING, allowNull: false },
		link: { type: DataTypes.STRING, allowNull: false },
		nextBook: { type: DataTypes.BOOLEAN, allowNull: true },
		finishedBook: { type: DataTypes.BOOLEAN, allowNull: true },
		userId: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'user', key: '_id' } },
	},
	{
		sequelize,
		modelName: 'book',
		tableName: 'books',
		timestamps: true,
		underscored: true,
	}
);
