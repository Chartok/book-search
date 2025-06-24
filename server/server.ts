import { ApolloServer } from '@apollo/server';
<<<<<<< HEAD
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from '@as-integrations/express4';
import express from 'express';
import http from 'http';
import cors from 'cors';
import db from './config/connection';
=======
import { startStandaloneServer } from '@apollo/server/standalone';
>>>>>>> 6b36f2de9d46905062e2ab1260eedf8f21675362
import { typeDefs, resolvers } from './schemas';
import { connectToDatabase } from './config/connection';
import { authMiddleware } from './utils/auth';

<<<<<<< HEAD
const app = express();
const httpServer = http.createServer(app);

const server = new ApolloServer<authMiddleware>({
	typeDefs,
	resolvers,
	plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();
app.use(
	'/graphql',
	cors<cors.CorsRequest>(),
	express.json(),
	expressMiddleware(server, {
		context: authMiddleware,
	})
);

if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname, '../client/dist')));
}
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

db.once('open', () => {
	app.listen(PORT, () => {
		console.log(`🌍 Now listening on port ${PORT}/graphql!`);
	});
});

await new Promise<void>((resolve) =>
	httpServer.listen({ port: process.env.PORT || 4000 }, resolve)
);
console.log(
	`🚀 Server ready at http://localhost:${process.env.PORT || 4000}/graphql`
);
=======
const PORT = process.env.PORT;

const server = new ApolloServer({ typeDefs, resolvers });

const { url } = await startStandaloneServer(server, {
	context: ({ req }) => authMiddleware({ req }),
  
	listen: { port: PORT },
});

console.log(`Apollo/Server ready @${url}`);
>>>>>>> 6b36f2de9d46905062e2ab1260eedf8f21675362
