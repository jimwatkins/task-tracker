import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './schema';
import testResolvers from './test-resolvers';

const server = new ApolloServer({
  typeDefs,
  resolvers: testResolvers
});

startStandaloneServer(server, {
  listen: { port: 4001 }
}).then(({ url }: { url: string }) => {
  console.log(`🚀 Server ready at ${url}`);
}); 