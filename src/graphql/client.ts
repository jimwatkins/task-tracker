import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';
import { setErrorMessage, errorMessageVar } from './cache';

console.log('Initializing Apollo Client...');

// Create the HTTP link with fetch options
const httpLink = createHttpLink({
  uri: 'http://localhost:4001/graphql',
  fetchOptions: {
    mode: 'cors',
  },
});

// Create the retry link
const retryLink = new RetryLink({
  delay: {
    initial: 300,
    max: 3000,
    jitter: true
  },
  attempts: {
    max: 3,
    retryIf: (error, _operation) => {
      console.log('Checking if should retry:', error);
      // Don't retry if it's a GraphQL error
      if (error.graphQLErrors) return false;
      
      // Retry on network errors
      if (error.networkError) {
        console.log('Network error occurred, retrying...', error.networkError);
        return true;
      }
      
      return false;
    }
  }
});

// Create the error handling link
const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  console.log('Error link triggered:', { graphQLErrors, networkError, operation });

  if (graphQLErrors) {
    console.error('[GraphQL Error]', {
      operation: operation.operationName,
      errors: graphQLErrors,
    });
    const message = graphQLErrors[0].message;
    if (message) {
      console.log('Setting GraphQL error message:', message);
      setErrorMessage(message);
    }
  }

  if (networkError) {
    console.error('[Network Error]', {
      operation: operation.operationName,
      error: networkError,
    });

    let message = 'A network error occurred. Please try again.';

    // Check if it's a connection error
    if (networkError.message.includes('Failed to fetch')) {
      message = 'Unable to connect to the server. Please check if the server is running and try again.';
    } else if ('statusCode' in networkError) {
      const statusCode = (networkError as any).statusCode;
      switch (statusCode) {
        case 400:
          message = 'Bad Request - The server could not understand the request.';
          break;
        case 401:
          message = 'Unauthorized - Please log in to continue.';
          break;
        case 403:
          message = 'Forbidden - You do not have permission to access this resource.';
          break;
        case 404:
          message = 'Not Found - The requested resource could not be found.';
          break;
        case 500:
          message = 'Internal Server Error - Something went wrong on the server.';
          break;
        case 503:
          message = 'Service Unavailable - The server is temporarily unable to handle the request.';
          break;
        default:
          message = `Server Error (${statusCode}) - Please try again later.`;
      }
    }

    console.log('Setting network error message:', message);
    setErrorMessage(message);
  }
});

// Create the Apollo Client instance
export const client = new ApolloClient({
  link: from([errorLink, retryLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          // Prevent the error message from being cleared on cache updates
          errorMessage: {
            read() {
              const current = errorMessageVar();
              return current || null;
            }
          }
        }
      }
    }
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});

console.log('Apollo Client initialized'); 