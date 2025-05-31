import { UserRole, TaskStatus, Priority } from '../enums';
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
//# sourceMappingURL=index.d.ts.map