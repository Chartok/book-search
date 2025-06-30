import { DataTypes, Model } from 'sequelize';
import { sequelize } from './index';

export class Book extends Model {
	public id!: number;
	public title!: string;
	public description!: string;
	public image!: string;
	public link!: string;
}

Book.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		title: { type: DataTypes.STRING, allowNull: false },
		description: { type: DataTypes.STRING, allowNull: false },
		image: { type: DataTypes.STRING },
		link: { type: DataTypes.STRING },
	},
	{
		sequelize,
		modelName: 'book',
	}
);
