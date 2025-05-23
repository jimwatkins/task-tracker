import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_TASKS } from '../graphql/operations';
import { FaCheckCircle, FaSpinner, FaRegCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  CircularProgress,
  Alert,
  Button,
  Stack,
} from '@mui/material';

// Assuming a Task type is generated and available, e.g., from a GraphQL codegen process
// You might need to adjust the import path based on your actual generated types file
// import { Task } from '../graphql/generated-types'; // Example generated types file

// If no generated type is easily available, define a minimal type based on the query
interface Task { // Consider moving this to a shared types file if needed elsewhere
  id: number;
  title: string;
  description?: string | null;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  dueDate?: string | null;
  assignedTo?: { id: number; name: string } | null;
  createdBy: { id: number; name: string };
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

const statusConfig = {
  COMPLETED: {
    color: 'success',
    icon: <FaCheckCircle style={{ marginRight: 6, verticalAlign: 'middle' }} />,
    label: 'Completed',
  },
  IN_PROGRESS: {
    color: 'primary',
    icon: <FaSpinner style={{ marginRight: 6, verticalAlign: 'middle' }} />,
    label: 'In Progress',
  },
  NOT_STARTED: {
    color: 'default',
    icon: <FaRegCircle style={{ marginRight: 6, verticalAlign: 'middle' }} />,
    label: 'Not Started',
  },
};

const Tasks = () => {
  const { loading, error, data } = useQuery(GET_TASKS, {
    variables: { tenantId: 'tenant1' }, // TODO: Get this from auth context
  });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert 
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => window.location.reload()}>
              Retry
            </Button>
          }
        >
          Could not load tasks: {error.message}
        </Alert>
      </Container>
    );
  }

  const tasks = data?.tasks || [];

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Stack spacing={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Seasonal Tasks
        </Typography>

        <Paper elevation={2}>
          <Stack spacing={0}>
            {tasks.map((task: Task) => {
              const config = statusConfig[task.status];
              return (
                <Link 
                  to={`/tasks/${task.id}/edit`} 
                  key={task.id}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <Box
                    sx={{
                      p: 2,
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      '&:last-child': {
                        borderBottom: 'none',
                      },
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          {task.title}
                        </Typography>
                        {task.description && (
                          <Typography variant="body2" color="text.secondary">
                            {task.description}
                          </Typography>
                        )}
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 1,
                          bgcolor: `${config.color}.lighter`,
                          color: `${config.color}.main`,
                          border: 1,
                          borderColor: `${config.color}.light`,
                        }}
                      >
                        {config.icon}
                        {config.label}
                      </Box>
                    </Stack>
                  </Box>
                </Link>
              );
            })}
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
};

export default Tasks; 