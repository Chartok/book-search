// server/config/database.ts
import 'dotenv/config';
import type { Dialect } from 'sequelize';

interface EnvConfig {
	username: string;
	password: string;
	database: string;
	host: string;
	port: number;
	dialect: Dialect;
	logging?: boolean;
}

interface Config {
	development: EnvConfig;
	test: EnvConfig;
	production: EnvConfig;
}

const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;

if (!DB_NAME) {
	throw new Error('Environment variable DB_NAME is required');
}

const base: Omit<EnvConfig, 'database'> = {
	username:
		DB_USER ??
		(() => {
			throw new Error('Environment variable DB_USER is required');
		})(),
	password:
		DB_PASSWORD ??
		(() => {
			throw new Error('DB_PASSWORD environment variable is not set');
		})(),
	host: DB_HOST ?? 'localhost',
	port: DB_PORT ? parseInt(DB_PORT, 10) : 3306,
	dialect: (process.env.DB_DIALECT as Dialect) ?? 'mysql',
	logging: false, // CLI doesn’t care, but you can turn it on/off here
};

const config: Config = {
	development: {
		...base,
		database: `${DB_NAME}`,
	},
	test: {
		...base,
		database: `${DB_NAME}`,
		logging: false, // keep tests quiet
	},
	production: {
		...base,
		database: `${DB_NAME}`,
		logging: false, // set based on your prod needs
	},
};

export default config;
