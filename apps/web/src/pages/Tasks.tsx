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
import { getErrorMessage } from '../utils/errorHandling';
import { setErrorMessage } from '../graphql/cache';

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
    onError: (error) => {
      const errorDetails = getErrorMessage(error);
      setErrorMessage(errorDetails.message);
    },
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
        <Alert severity="error" sx={{ mb: 2 }}>
          {getErrorMessage(error).message}
        </Alert>
        <Button
          variant="contained"
          color="primary"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </Container>
    );
  }

  const tasks = data?.tasks || [];

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Tasks
        </Typography>
        <Button
          component={Link}
          to="/tasks/new"
          variant="contained"
          color="primary"
        >
          Create Task
        </Button>
      </Stack>

      {tasks.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No tasks found. Create your first task!
          </Typography>
        </Paper>
      ) : (
        <Stack spacing={2}>
          {tasks.map((task: Task) => (
            <Paper
              key={task.id}
              sx={{
                p: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box>
                <Typography variant="h6" component="h2">
                  {task.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {task.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Assigned to: {task.assignedTo?.name || 'Unassigned'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography
                  variant="body2"
                  color={`${statusConfig[task.status].color}.main`}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  {statusConfig[task.status].icon}
                  {statusConfig[task.status].label}
                </Typography>
                <Button
                  component={Link}
                  to={`/tasks/${task.id}/edit`}
                  variant="outlined"
                  size="small"
                >
                  Edit
                </Button>
              </Box>
            </Paper>
          ))}
        </Stack>
      )}
    </Container>
  );
};

export default Tasks; 