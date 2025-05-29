import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { GET_TASK, UPDATE_TASK } from '../graphql/operations';
import type { Task } from '../types';
import { TaskStatus } from '../types';
import { Box, Typography, TextField, Button, MenuItem, CircularProgress, Alert } from '@mui/material';
import { useSnackbar } from 'notistack';

const EditTask = () => {
  const { id: idParam } = useParams<{ id: string }>();
  const id = idParam ? parseInt(idParam, 10) : null;
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState<Partial<Task>>({
    title: '',
    description: '',
    status: TaskStatus.NOT_STARTED,
    dueDate: '',
  });

  const { loading, error, data } = useQuery(GET_TASK, {
    variables: { id },
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
    skip: !id,
  });

  const [updateTask, { loading: updating }] = useMutation(UPDATE_TASK, {
    onCompleted: (data) => {
      console.log('Mutation completed successfully:', data);
      enqueueSnackbar('Task updated successfully', { variant: 'success' });
      navigate('/tasks');
    },
    onError: (error) => {
      console.error('Error updating task:', error);
      console.error('Error details:', {
        message: error.message,
        graphQLErrors: error.graphQLErrors,
        networkError: error.networkError,
        stack: error.stack,
      });
      enqueueSnackbar(error.message, { variant: 'error' });
    },
  });

  useEffect(() => {
    if (data?.task) {
      console.log('Received task data:', data.task);
      setFormData({
        title: data.task.title,
        description: data.task.description || '',
        status: data.task.status,
        dueDate: data.task.dueDate ? new Date(data.task.dueDate).toISOString().split('T')[0] : '',
      });
    }
  }, [data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !data?.task) return;

    console.log('Current formData:', formData);
    console.log('Current task data:', data.task);

    const input = {
      id,
      title: formData.title,
      description: formData.description,
      status: formData.status,
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
    };

    console.log('Mutation input:', input);
    console.log('Mutation variables:', { input });

    updateTask({
      variables: {
        input,
      },
    }).catch(error => {
      console.error('Mutation error:', error);
      console.error('Error details:', {
        message: error.message,
        graphQLErrors: error.graphQLErrors,
        networkError: error.networkError,
        stack: error.stack,
      });
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error.message}
        </Alert>
        <Button variant="contained" onClick={() => navigate('/tasks')}>
          Back to Tasks
        </Button>
      </Box>
    );
  }

  if (!data?.task) {
    return (
      <Box p={3}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Task not found
        </Alert>
        <Button variant="contained" onClick={() => navigate('/tasks')}>
          Back to Tasks
        </Button>
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Edit Task
      </Typography>
      
      <TextField
        fullWidth
        label="Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        required
        margin="normal"
      />
      
      <TextField
        fullWidth
        label="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        multiline
        rows={4}
        margin="normal"
      />
      
      <TextField
        fullWidth
        select
        label="Status"
        value={formData.status}
        onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
        margin="normal"
      >
        {Object.values(TaskStatus).map((status) => (
          <MenuItem key={status} value={status}>
            {status}
          </MenuItem>
        ))}
      </TextField>
      
      <TextField
        fullWidth
        label="Due Date"
        type="date"
        value={formData.dueDate}
        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
        margin="normal"
        InputLabelProps={{ shrink: true }}
      />
      
      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={updating}
        >
          {updating ? <CircularProgress size={24} /> : 'Save Changes'}
        </Button>
        <Button
          variant="outlined"
          onClick={() => navigate('/tasks')}
          disabled={updating}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default EditTask; 