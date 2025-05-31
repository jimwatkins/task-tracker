import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Snackbar, Alert } from '@mui/material';
import { ApolloProvider } from '@apollo/client';
import { useReactiveVar } from '@apollo/client';
import { SnackbarProvider } from 'notistack';
import theme from './theme';
import { client } from './graphql/client';
import { ErrorBoundary, Layout } from '@task-tracker/ui';
import Home from './pages/Home';
import Tasks from './pages/Tasks';
import Profile from './pages/Profile';
import EditTask from './pages/EditTask';
import { errorMessageVar } from './graphql/cache';

function App() {
  const errorMessage = useReactiveVar(errorMessageVar);
  
  console.log('Current error message in App:', errorMessage);

  const handleCloseError = () => {
    console.log('Closing error message in App');
    errorMessageVar(null);
  };

  const showError = Boolean(errorMessage && errorMessage.trim());

  return (
    <ErrorBoundary>
      <ApolloProvider client={client}>
        <ThemeProvider theme={theme}>
          <SnackbarProvider maxSnack={3}>
            <CssBaseline />
            <Router>
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/tasks" element={<Tasks />} />
                  <Route path="/tasks/:id/edit" element={<EditTask />} />
                  <Route path="/profile" element={<Profile />} />
                </Routes>
              </Layout>
            </Router>
            {showError && (
              <Snackbar
                open={showError}
                autoHideDuration={6000}
                onClose={handleCloseError}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              >
                <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
                  {errorMessage}
                </Alert>
              </Snackbar>
            )}
          </SnackbarProvider>
        </ThemeProvider>
      </ApolloProvider>
    </ErrorBoundary>
  );
}

export default App;
