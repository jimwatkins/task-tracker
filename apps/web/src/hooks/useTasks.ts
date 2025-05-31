import { useQuery, useMutation, useSubscription } from '@apollo/client';
import {
  GET_TASKS,
  GET_TASK,
  CREATE_TASK,
  UPDATE_TASK,
  DELETE_TASK,
  TASK_SUBSCRIPTION,
} from '../graphql/operations';

export const useTasks = (tenantId: string) => {
  const { data: tasksData, loading: tasksLoading, error: tasksError } = useQuery(GET_TASKS, {
    variables: { tenantId },
  });

  const [createTaskMutation] = useMutation(CREATE_TASK);
  const [updateTaskMutation] = useMutation(UPDATE_TASK);
  const [deleteTaskMutation] = useMutation(DELETE_TASK);

  // Subscribe to task updates
  const { data: subscriptionData } = useSubscription(TASK_SUBSCRIPTION, {
    variables: { tenantId },
  });

  const createTask = async (taskData: {
    title: string;
    description?: string;
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
    dueDate?: string;
    assignedToId?: string;
  }) => {
    try {
      const { data } = await createTaskMutation({
        variables: {
          ...taskData,
          tenantId,
        },
      });
      return data.createTask;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  };

  const updateTask = async (
    id: string,
    taskData: {
      title?: string;
      description?: string;
      status?: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
      dueDate?: string;
      assignedToId?: string;
    }
  ) => {
    try {
      const { data } = await updateTaskMutation({
        variables: {
          id,
          ...taskData,
        },
      });
      return data.updateTask;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const { data } = await deleteTaskMutation({
        variables: { id },
      });
      return data.deleteTask;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  };

  return {
    tasks: tasksData?.tasks || [],
    loading: tasksLoading,
    error: tasksError,
    createTask,
    updateTask,
    deleteTask,
    subscriptionData,
  };
}; 