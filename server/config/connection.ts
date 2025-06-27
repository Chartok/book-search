import 'dotenv/config'; 
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
	process.env.MYSQL_DATABASE || 'database',
	process.env.MYSQL_USER || 'username',
	process.env.MYSQL_PASSWORD || 'password',
	{
		host: process.env.MYSQL_HOST,
		dialect: 'mysql',
		logging: false,

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
			timestamps: true,
		},

		// pool configuration used to pool database connections
		pool: {
			max: 5,
			idle: 30000,
			acquire: 60000,
		},
	}
);

async function connectToDB() {
	try {
		await sequelize.authenticate();
		console.log('Database connection established successfully');
	} catch (error) {
		console.error('Error connecting to the database:', error);
		return error;
	}
}

async function disconnectFromDB() {
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

export { sequelize, connectToDB, disconnectFromDB };


