import 'dotenv/config';
import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize(process.env.DB_URI, {
	dialect: 'mysql',
	logging: console.log,

	omitNull: true,
	native: true,
	ssl: true,

	define: {
		underscored: false,
		freezeTableName: false,
		charset: 'utf8',
		dialectOptions: {
			collate: 'utf8_general_ci',
		},
		timestamps: false,
	},

	// pool configuration used to pool database connections
	pool: {
		max: 5,
		idle: 30000,
		acquire: 60000,
	},
});

export async function connectToDB() {
	try {
		await sequelize.authenticate();
		console.log('Database connection established successfully');
	} catch (error) {
		console.error('Error connecting to the database:', error);
		return error;
	}
}

export async function disconnectFromDB() {
	try {
		await sequelize.close();
		console.log('Database connection closed successfully');
	} catch (error) {
		console.error('Error closing database connection:', error);
		return error;
	}
}

process.on('SIGINT', async () => {
	await disconnectFromDB();
	process.exit(0);
});

export default { sequelize, connectToDB, disconnectFromDB };
