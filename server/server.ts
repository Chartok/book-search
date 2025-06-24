import express from 'express';
import path from 'path';
import { ApolloServer } from 'apollo-server-express';
import db from './config/connection';
import { typeDefs, resolvers } from './schemas';
import { authMiddleware } from './utils/auth';

const app = express ();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

async function startApollo() {
  await server.start();
  server.applyMiddleware({ app });


  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));
  }
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`🌍 Now listening on localhost:${PORT}${server.graphqlPath}`);
    });
  });
}

startApollo();
