import { ApolloClient, InMemoryCache, createHttpLink, split } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';
import { typeDefs } from './schema';

// HTTP connection to the API
const httpLink = createHttpLink({
  uri: 'http://localhost:4001/graphql', // Replace with your GraphQL server URL
});

// WebSocket connection for subscriptions
const wsLink = new GraphQLWsLink(
  createClient({
    url: 'ws://localhost:4001/graphql', // Replace with your WebSocket server URL
  })
);

// Split links based on operation type
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink
);

// Cache configuration
const cache = new InMemoryCache({
  typePolicies: {
    Task: {
      keyFields: ['id'],
      fields: {
        // Add any field policies here if needed
      },
    },
    User: {
      keyFields: ['id'],
    },
  },
});

// Create the Apollo Client instance
export const client = new ApolloClient({
  link: splitLink,
  cache,
  typeDefs,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
}); 