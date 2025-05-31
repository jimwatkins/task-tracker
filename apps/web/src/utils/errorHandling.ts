import { GraphQLError } from 'graphql';

// Define NetworkError type since it's not exported from @apollo/client
interface NetworkError extends Error {
  statusCode?: number;
  result?: {
    errors?: GraphQLError[];
  };
}

export interface ErrorDetails {
  message: string;
  code?: string;
  statusCode?: number;
}

// Map of HTTP status codes to user-friendly messages
const HTTP_STATUS_MESSAGES: Record<number, string> = {
  400: 'Bad Request - The server could not understand the request due to invalid syntax or missing parameters.',
  401: 'Unauthorized - Authentication is required to access this resource.',
  403: 'Forbidden - You do not have permission to access this resource.',
  404: 'Not Found - The requested resource could not be found.',
  408: 'Request Timeout - The server took too long to respond.',
  409: 'Conflict - The request conflicts with the current state of the server.',
  422: 'Unprocessable Entity - The request was well-formed but had semantic errors.',
  429: 'Too Many Requests - You have exceeded the rate limit. Please try again later.',
  500: 'Internal Server Error - Something went wrong on the server.',
  502: 'Bad Gateway - The server received an invalid response from an upstream server.',
  503: 'Service Unavailable - The server is temporarily unable to handle the request.',
  504: 'Gateway Timeout - The server took too long to respond.',
};

// Helper function to get HTTP status message
const getHttpStatusMessage = (statusCode: number): string => {
  return HTTP_STATUS_MESSAGES[statusCode] || `HTTP Error ${statusCode} - An unexpected error occurred.`;
};

// Helper function to get error message from GraphQL error
const getGraphQLErrorMessage = (error: GraphQLError): string => {
  if (error.extensions?.code === 'BAD_USER_INPUT') {
    return `Invalid input: ${error.message}`;
  }
  if (error.extensions?.code === 'FORBIDDEN') {
    return 'You do not have permission to perform this action.';
  }
  if (error.extensions?.code === 'NOT_FOUND') {
    return 'The requested resource was not found.';
  }
  return error.message;
};

// Main function to get error message
export const getErrorMessage = (error: Error | GraphQLError | NetworkError): string => {
  // Handle GraphQL errors
  if (error instanceof GraphQLError) {
    return getGraphQLErrorMessage(error);
  }

  // Handle network errors
  if ('statusCode' in error) {
    const networkError = error as NetworkError;
    if (networkError.statusCode) {
      return getHttpStatusMessage(networkError.statusCode);
    }
    if (networkError.result?.errors?.[0]) {
      return getGraphQLErrorMessage(networkError.result.errors[0]);
    }
  }

  // Handle generic errors
  if (error.message.includes('Failed to fetch')) {
    return 'Unable to connect to the server. Please check your internet connection and try again.';
  }

  return error.message || 'An unexpected error occurred. Please try again.';
};

export const shouldRetry = (error: unknown): boolean => {
  const errorDetails = getErrorMessage(error);
  return errorDetails.retryable;
};

export const isServerUnavailable = (error: unknown): boolean => {
  const errorDetails = getErrorMessage(error);
  return errorDetails.type === 'network' && 
         errorDetails.message.includes('Unable to connect to the server');
};

export const isTimeoutError = (error: unknown): boolean => {
  const errorDetails = getErrorMessage(error);
  return errorDetails.type === 'network' && 
         errorDetails.message.includes('Request timed out');
};

export const isCorsError = (error: unknown): boolean => {
  const errorDetails = getErrorMessage(error);
  return errorDetails.type === 'network' && 
         errorDetails.message.includes('Cross-origin request failed');
}; 