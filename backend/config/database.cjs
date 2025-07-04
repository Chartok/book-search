// backend/config/database.js
require('dotenv').config();

module.exports = {
	development: {
		username: process.env.DB_USER || '',
		password: process.env.DB_PASSWORD || '',
		database: process.env.DB_NAME || '',
		host: process.env.DB_HOST || '127.0.0.1',
		port: Number(process.env.DB_PORT) || 3306,
		dialect: 'mysql',
		logging: console.log,
	},
	test: {
		username: process.env.DB_USER || '',
		password: process.env.DB_PASSWORD || '',
		database: process.env.DB_NAME + '_test',
		host: process.env.DB_HOST || '127.0.0.1',
		port: Number(process.env.DB_PORT) || 3306,
		dialect: 'mysql',
		logging: false,
	},
	production: {
		username: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
		host: process.env.DB_HOST,
		port: Number(process.env.DB_PORT),
		dialect: 'mysql',
		logging: false,
	},
};
