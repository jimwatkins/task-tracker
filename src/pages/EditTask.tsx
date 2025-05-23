import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { GET_TASK, UPDATE_TASK } from '../graphql/operations'; // Adjust path as needed
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Box,
  Chip,
  CircularProgress,
  Alert,
  Stack,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import type { GridProps } from '@mui/material/Grid';
import Grid from '@mui/material/Grid';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';

interface TaskData {
  task: {
    id: number;
    title: string;
    description?: string | null;
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
    dueDate?: string | null;
    scheduledDate?: string | null;
    completionDate?: string | null;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | null;
    isRecurring?: boolean | null;
    assignedToId?: number | null;
    assignedTo?: { id: number; name: string } | null;
    createdBy: { id: number; name: string };
    createdAt: string;
    updatedAt: string;
  } | null;
}

interface UpdateTaskInput {
  id: number;
  title?: string | null;
  description?: string | null;
  status?: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | null;
  dueDate?: string | null;
  scheduledDate?: string | null;
  completionDate?: string | null;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | null;
  isRecurring?: boolean | null;
  assignedToId?: number | null;
}

const EditTask: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const taskId = id ? parseInt(id) : null;

  const { loading, error, data } = useQuery<TaskData>(GET_TASK, {
    variables: { id: taskId },
    skip: taskId === null,
  });

  const [updateTaskMutation] = useMutation(UPDATE_TASK);

  const [formData, setFormData] = useState<UpdateTaskInput>({
    id: taskId || 0,
    title: '',
    description: '',
    status: 'NOT_STARTED',
    dueDate: '',
    scheduledDate: '',
    completionDate: '',
    priority: null,
    isRecurring: false,
    assignedToId: null,
  });

  useEffect(() => {
    if (data?.task) {
      setFormData({
        id: data.task.id,
        title: data.task.title || '',
        description: data.task.description || '',
        status: data.task.status || 'NOT_STARTED',
        dueDate: data.task.dueDate || '',
        scheduledDate: data.task.scheduledDate || '',
        completionDate: data.task.completionDate || '',
        priority: data.task.priority || null,
        isRecurring: data.task.isRecurring || false,
        assignedToId: data.task.assignedToId || null,
      });
    }
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
      setFormData({
        ...formData,
        [name]: e.target.checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      await updateTaskMutation({
        variables: {
          input: {
            id,
            ...(formData.title !== '' && { title: formData.title }),
            ...(formData.description !== '' && { description: formData.description }),
            ...(formData.status !== 'NOT_STARTED' && { status: formData.status }),
            ...(formData.dueDate !== '' && { dueDate: formData.dueDate }),
            ...(formData.scheduledDate !== '' && { scheduledDate: formData.scheduledDate }),
            ...(formData.completionDate !== '' && { completionDate: formData.completionDate }),
            ...(formData.priority !== null && { priority: formData.priority }),
            ...(formData.isRecurring !== undefined && { isRecurring: formData.isRecurring }),
            ...(formData.assignedToId !== null && { assignedToId: formData.assignedToId }),
          },
        },
      });
      navigate('/tasks');
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <CircularProgress />
    </Box>
  );
  
  if (error) return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Alert severity="error">Error loading task: {error.message}</Alert>
    </Container>
  );
  
  if (!data?.task) return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Alert severity="warning">Task not found.</Alert>
    </Container>
  );

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Stack spacing={3}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h4" component="h1" gutterBottom>
              Edit Task
            </Typography>
            <Chip 
              label={formData.status?.replace('_', ' ') || 'Not Started'} 
              color={
                formData.status === 'COMPLETED' ? 'success' :
                formData.status === 'IN_PROGRESS' ? 'primary' :
                'default'
              }
            />
          </Box>

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <Box>
                <TextField
                  fullWidth
                  label="Title"
                  id="title"
                  name="title"
                  value={formData.title || ''}
                  onChange={handleChange}
                  required
                  variant="outlined"
                />
              </Box>

              <Box>
                <TextField
                  fullWidth
                  label="Description"
                  id="description"
                  name="description"
                  value={formData.description || ''}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  variant="outlined"
                />
              </Box>

              <Box display="flex" gap={3}>
                <Box flex={1}>
                  <FormControl fullWidth>
                    <InputLabel id="status-label">Status</InputLabel>
                    <Select
                      labelId="status-label"
                      id="status"
                      name="status"
                      value={formData.status || ''}
                      onChange={handleSelectChange}
                      label="Status"
                      required
                    >
                      <MenuItem value="NOT_STARTED">Not Started</MenuItem>
                      <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                      <MenuItem value="COMPLETED">Completed</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Box flex={1}>
                  <FormControl fullWidth>
                    <InputLabel id="priority-label">Priority</InputLabel>
                    <Select
                      labelId="priority-label"
                      id="priority"
                      name="priority"
                      value={formData.priority || ''}
                      onChange={handleSelectChange}
                      label="Priority"
                    >
                      <MenuItem value="">Select Priority</MenuItem>
                      <MenuItem value="LOW">Low</MenuItem>
                      <MenuItem value="MEDIUM">Medium</MenuItem>
                      <MenuItem value="HIGH">High</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>

              <Box display="flex" gap={3}>
                <Box flex={1}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Due Date"
                      value={formData.dueDate ? new Date(formData.dueDate) : null}
                      onChange={(newValue: Date | null) => {
                        setFormData({
                          ...formData,
                          dueDate: newValue ? format(newValue, 'yyyy-MM-dd') : '',
                        });
                      }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          variant: 'outlined',
                        },
                      }}
                    />
                  </LocalizationProvider>
                </Box>

                <Box flex={1}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Scheduled Date"
                      value={formData.scheduledDate ? new Date(formData.scheduledDate) : null}
                      onChange={(newValue: Date | null) => {
                        setFormData({
                          ...formData,
                          scheduledDate: newValue ? format(newValue, 'yyyy-MM-dd') : '',
                        });
                      }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          variant: 'outlined',
                        },
                      }}
                    />
                  </LocalizationProvider>
                </Box>
              </Box>

              <Box>
                <FormControlLabel
                  control={
                    <Checkbox
                      id="isRecurring"
                      name="isRecurring"
                      checked={formData.isRecurring || false}
                      onChange={handleChange}
                    />
                  }
                  label="Is Recurring Task"
                />
              </Box>

              <Box display="flex" gap={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  onClick={() => navigate('/tasks')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  Save Changes
                </Button>
              </Box>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Container>
  );
};

export default EditTask; 