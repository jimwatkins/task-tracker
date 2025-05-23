export type TaskStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
export type UserRole = 'ADMIN' | 'MANAGER' | 'USER';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  tenantId: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string | null;
  status: TaskStatus;
  dueDate?: string | null;
  scheduledDate?: string | null;
  completionDate?: string | null;
  priority?: Priority | null;
  isRecurring?: boolean | null;
  assignedTo?: User | null;
  createdBy: User;
  createdById: number;
  assignedToId?: number | null;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string | null;
  status: TaskStatus;
  dueDate?: string | null;
  scheduledDate?: string | null;
  priority?: Priority | null;
  isRecurring?: boolean | null;
  assignedToId?: number | null;
  tenantId: string;
  createdById: number;
}

export interface UpdateTaskInput {
  id: number;
  title?: string | null;
  description?: string | null;
  status?: TaskStatus | null;
  dueDate?: string | null;
  scheduledDate?: string | null;
  completionDate?: string | null;
  priority?: Priority | null;
  isRecurring?: boolean | null;
  assignedToId?: number | null;
} 