import 'dotenv/config';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs, resolvers } from './schemas/index.ts';
import { connectToDatabase } from './config/connection.ts';
import { authMiddleware } from './utils/auth.ts';

const PORT = process.env.PORT;

const server = new ApolloServer({ typeDefs, resolvers });

try {
	await connectToDatabase();
	console.log('Connected to MongoDB');
} catch (error) {
	console.error('Error connecting to MongoDB:', error);
	process.exit(1);
}

const { url } = await startStandaloneServer(server, {
	context:  ({ req }) => authMiddleware({ req }),  
	listen: { port: PORT },
});

console.log(`Apollo/Server ready @${url}`);
