import { ApolloServer } from 'apollo-server-express';
import { startStandaloneServer } from '@apollo/server/standalone';
import path from 'path';
import db from './config/connection';
import { typeDefs, resolvers } from './schemas';
import { authMiddleware } from './utils/auth';

interface MyContext {
    token?: string;
}

const PORT = process.env.PORT || 4000;

const server = new ApolloServer<MyContext>({ typeDefs, resolvers });

const { url } = await startStandaloneServer(server, {
    context: async ({ req }) => authMiddleware,
    listen: { port: 4000 },
});

console.log(`Apollo/Server ready @${url}`);

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`🌍 Now listening on localhost:${PORT}${server.graphqlPath}`);
    });
  });
}

startApollo();
