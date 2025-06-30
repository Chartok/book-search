import { DataTypes, Model } from 'sequelize';
import bcrypt from 'bcrypt';
import { sequelize } from './index';

export class User extends Model {
	public id!: number;
	public username!: string;
	public email!: string;
	public password!: string;
	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;

	public async isValidPassword(password: string): Promise<boolean> {
		return bcrypt.compare(password, this.password);
	}
}

User.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		username: { type: DataTypes.STRING, allowNull: false, unique: true },
		email: { type: DataTypes.STRING, allowNull: false, unique: true },
		password: { type: DataTypes.STRING, allowNull: false },
	},
	{
		sequelize,
		modelName: 'user',
		hooks: {
			beforeCreate: async (user: any) => {
				user.password = await bcrypt.hash(user.password, 10);
			},
		},
	}
);
