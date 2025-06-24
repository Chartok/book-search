import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from '@as-integrations/express4';
import express from 'express';
import http from 'http';
import cors from 'cors';
import db from './config/connection';
import { typeDefs, resolvers } from './schemas';
import { authMiddleware } from './utils/auth';

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
