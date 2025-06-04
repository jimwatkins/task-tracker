import { TaskStatus, Priority, UserRole } from './generated/graphql';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  dueDate?: string;
  createdBy: User;
  createdAt: string;
  updatedAt: string;
}

export interface Context {
  // Add any context properties here
  // For example: user?: User;
} 