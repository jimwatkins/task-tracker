import { gql } from 'graphql-tag';
import { DocumentNode } from 'graphql';

export const typeDefs: DocumentNode = gql`
  enum TaskStatus {
    TODO
    IN_PROGRESS
    DONE
  }

  enum UserRole {
    ADMIN
    USER
  }

  enum Priority {
    LOW
    MEDIUM
    HIGH
  }

  type Task {
    id: ID!
    title: String!
    description: String
    status: TaskStatus!
    priority: Priority!
    dueDate: String
    scheduledDate: String
    completionDate: String
    isRecurring: Boolean
    createdBy: User!
    assignedTo: User
    createdAt: String!
    updatedAt: String!
  }

  type User {
    id: ID!
    email: String!
    name: String!
    role: UserRole!
  }

  type Query {
    tasks(tenantId: String!): [Task!]!
    task(id: ID!): Task
    users(tenantId: String!): [User!]!
    user(id: ID!): User
  }

  input CreateTaskInput {
    title: String!
    description: String
    status: TaskStatus!
    priority: Priority!
    dueDate: String
    createdById: ID!
  }

  input UpdateTaskInput {
    id: ID!
    title: String
    description: String
    status: TaskStatus
    priority: Priority
    dueDate: String
  }

  type Mutation {
    createTask(input: CreateTaskInput!): Task!
    updateTask(input: UpdateTaskInput!): Task!
    deleteTask(id: ID!): Boolean!
  }
`; 