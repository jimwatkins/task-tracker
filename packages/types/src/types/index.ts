import { TaskStatus, Priority } from '../enums'

export interface CreateTaskInput {
  title: string
  description?: string | null
  status: TaskStatus
  dueDate?: string | null
  scheduledDate?: string | null
  priority?: Priority | null
  isRecurring?: boolean | null
  assignedToId?: number | null
  tenantId: string
  createdById: number
}

export interface UpdateTaskInput {
  id: number
  title?: string | null
  description?: string | null
  status?: TaskStatus | null
  dueDate?: string | null
  scheduledDate?: string | null
  completionDate?: string | null
  priority?: Priority | null
  isRecurring?: boolean | null
  assignedToId?: number | null
} 