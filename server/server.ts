import 'dotenv/config';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { readFileSync } from "fs";
import path from "path";
import { gql } from "graphql-tag";
import { resolvers } from './resolvers/resolvers.ts';
import { sequelize } from './models/index.ts';
import { authMiddleware } from './utils/auth.ts';

const typeDefs = gql(
	readFileSync(path.resolve(__dirname, './schemas/schema.graphql'), {
	encoding: 'utf-8',
	})
);

const PORT = process.env.PORT || 4001;


async function startServer() {
	try {
		await sequelize();
		console.log('Connected to MySQL database successfully');
	} catch (error) {
		console.error('Error connecting to MySQL database:', error);
		process.exit(1);
	}
	
	const server = new ApolloServer({ typeDefs, resolvers });
	const { url } = await startStandaloneServer(server, {
		context:  ({ req }) => authMiddleware({ req }),  
		listen: { port: PORT },
	});

	console.log(`Apollo/Server ready @${url}`);
}

startServer();
