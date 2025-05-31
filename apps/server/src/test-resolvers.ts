import { Task, User, CreateTaskInput, UserRole, TaskStatus, Priority } from '@task-tracker/types';

const testResolvers = {
  Query: {
    tasks: () => [{
      id: '1',
      title: 'Test Task',
      description: 'This is a test task',
      status: TaskStatus.NOT_STARTED,
      priority: Priority.MEDIUM,
      dueDate: new Date().toISOString(),
      createdBy: {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: UserRole.USER
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }],
    task: (_: any, { id }: { id: string }) => ({
      id,
      title: 'Test Task',
      description: 'This is a test task',
      status: TaskStatus.NOT_STARTED,
      priority: Priority.MEDIUM,
      dueDate: new Date().toISOString(),
      createdBy: {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: UserRole.USER
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }),
    users: () => [{
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      role: UserRole.USER
    }],
    user: (_: any, { id }: { id: string }) => ({
      id,
      email: 'test@example.com',
      name: 'Test User',
      role: UserRole.USER
    })
  },
  Mutation: {
    createTask: (_: any, { input }: { input: CreateTaskInput }) => ({
      id: '1',
      ...input,
      createdBy: {
        id: input.createdById,
        email: 'test@example.com',
        name: 'Test User',
        role: UserRole.USER
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }),
    updateTask: (_: any, { input }: { input: { id: string } & Partial<CreateTaskInput> }) => ({
      id: input.id,
      title: 'Updated Task',
      description: 'This is an updated task',
      status: TaskStatus.IN_PROGRESS,
      priority: Priority.HIGH,
      dueDate: new Date().toISOString(),
      createdBy: {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: UserRole.USER
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }),
    deleteTask: () => true
  }
};

export default testResolvers; 