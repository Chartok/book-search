import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export const sequelize = new Sequelize(process.env.DB_URI as string, {
	dialect: 'mysql',
	logging: false,
});
