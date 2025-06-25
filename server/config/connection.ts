import 'dotenv/config'; // Ensure environment variables are loaded
import { Sequelize } from 'sequelize';
import { authMiddleware } from '../utils/auth.ts';

const sequelize: Sequelize | null = null;

export async function connectToDatabase() {
	if (!sequelize) {
		const {
			MYSQL_HOST,
			MYSQL_USER,
			MYSQL_PASSWORD,
			MYSQL_DATABASE,
		} = process.env;
		if (MYSQL_DATABASE) {
			sequelize = new Sequelize(MYSQL_DATABASE, { logging: false });
		} else {
			if (!MYSQL_DATABASE) {
				throw new Error('MySQL config not set in environment variables');
			}
			sequelize = new Sequelize(MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD, {
				host: MYSQL_HOST,
				dialect: 'mysql',
				logging: false,
			});
		}
	}
	await sequelize.authenticate({ authMiddleware });
	console.log('Database connection established successfully');
	return sequelize;
}

export function getSequelize() {
	if (!sequelize) throw new Error('Database not connected/initialized');
	return sequelize;
}
