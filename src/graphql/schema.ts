import { gql } from '@apollo/client';

export const typeDefs = gql`
  enum TaskStatus {
    NOT_STARTED
    IN_PROGRESS
    COMPLETED
  }

  enum UserRole {
    ADMIN
    MANAGER
    USER
  }

  enum Priority {
    LOW
    MEDIUM
    HIGH
  }

  type Task {
    id: Int!
    title: String!
    description: String
    status: TaskStatus!
    dueDate: String
    scheduledDate: String
    completionDate: String
    priority: Priority
    isRecurring: Boolean
    assignedTo: User
    createdBy: User!
    tenantId: String!
    createdAt: String!
    updatedAt: String!
  }

  type User {
    id: Int!
    name: String!
    email: String!
    role: UserRole!
    tenantId: String!
  }

  type Query {
    tasks(tenantId: String!): [Task!]!
    task(id: Int!): Task
    users(tenantId: String!): [User!]!
    user(id: Int!): User
  }

  input CreateTaskInput {
    title: String!
    description: String
    status: TaskStatus!
    dueDate: String
    scheduledDate: String
    priority: Priority
    isRecurring: Boolean
    assignedToId: Int
    tenantId: String!
    createdById: Int!
  }
  
  input UpdateTaskInput {
    id: Int!
    title: String
    description: String
    status: TaskStatus
    dueDate: String
    scheduledDate: String
    completionDate: String
    priority: Priority
    isRecurring: Boolean
    assignedToId: Int
  }
  
  type Mutation {
    createTask(
      input: CreateTaskInput
    ): Task!
    
    updateTask(
      input: UpdateTaskInput
    ): Task!
    
    deleteTask(id: Int!): Boolean!
  }

  type Subscription {
    taskUpdated(tenantId: String!): Task!
    taskCreated(tenantId: String!): Task!
    taskDeleted(tenantId: String!): Int!
  }
`; 