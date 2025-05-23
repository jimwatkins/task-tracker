import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import cors from 'cors';
import { json } from 'body-parser';

async function startServer() {
  console.log('Starting server initialization...');
  
  const app = express();
  console.log('Express app created');

  // Enable CORS for all routes
  app.use(cors());
  app.use(json());

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
  });
  console.log('Apollo Server instance created');

  try {
    await server.start();
    console.log('Apollo Server started successfully');

    // Mount the GraphQL middleware
    app.use('/graphql', expressMiddleware(server));
    console.log('GraphQL middleware configured');

    const PORT = process.env.PORT || 4001;
    app.listen(PORT, () => {
      console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
      console.log('Server is listening for requests...');
    });
  } catch (error) {
    console.error('Error starting server:', error);
    throw error;
  }
}

console.log('Starting server...');
startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
}); 