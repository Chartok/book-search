import { ApolloServer } from 'apollo-server-express';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs, resolvers } from './schemas';
import { authMiddleware } from './utils/auth';


const PORT = process.env.PORT;

const server = new ApolloServer({ typeDefs, resolvers });

const { url } = await startStandaloneServer(server, {
    context:  ({ req }) => authMiddleware({ req }),
    listen: { port: PORT },
});

console.log(`Apollo/Server ready @${url}`);


startApollo();
