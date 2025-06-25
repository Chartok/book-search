import 'dotenv/config'; // Ensure environment variables are loaded
import { Sequelize } from 'sequelize';

let sequelize: Sequelize | null = null;

export async function connectToDatabase() {
	if (!sequelize) {
		const {
			MYSQL_URI,
			MYSQL_HOST,
			MYSQL_USER,
			MYSQL_PASSWORD,
			MYSQL_DATABASE,
		} = process.env;
		if (MYSQL_URI) {
			sequelize = new Sequelize(MYSQL_URI, { logging: false });
		} else {
			if (!MYSQL_HOST || !MYSQL_USER || !MYSQL_DATABASE) {
				throw new Error('MySQL config not set in environment variables');
			}
			sequelize = new Sequelize(MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD, {
				host: MYSQL_HOST,
				dialect: 'mysql',
				logging: false,
			});
		}
	}
	await sequelize.authenticate();
	console.log('Database connection established successfully');
	return sequelize;
}

export function getSequelize() {
	if (!sequelize) throw new Error('Database not connected/initialized');
	return sequelize;
}
