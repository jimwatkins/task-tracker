import { makeVar } from '@apollo/client';

// Reactive variable for storing error messages
export const errorMessageVar = makeVar<string | null>(null);

// Helper function to set error message
export const setErrorMessage = (message: string | undefined | null) => {
  if (message === undefined || message === null) {
    console.log('Attempted to set undefined/null error message, ignoring');
    return;
  }
  console.log('Setting error message in cache:', message);
  errorMessageVar(message);
};

// Helper function to clear error message
export const clearErrorMessage = () => {
  console.log('Clearing error message in cache');
  errorMessageVar(null);
}; 