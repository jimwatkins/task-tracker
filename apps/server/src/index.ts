import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { typeDefs } from './schema';
import resolvers from './resolvers';
import { makeExecutableSchema } from '@graphql-tools/schema';

async function startApolloServer() {
  const app = express();
  const httpServer = http.createServer(app);

  // Apply middleware globally
  app.use(express.json());
  app.use(cors());

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const server = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }) => {
        // TODO: Add authentication context here
        return {
          // Add any context properties here
        };
      },
    }),
  );

  const PORT = process.env.PORT || 4001;

  await new Promise<void>((resolve) => httpServer.listen({ port: PORT }, resolve));
  console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
}

startApolloServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
}); 