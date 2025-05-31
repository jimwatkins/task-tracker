import { gql } from '@apollo/client';

export const GET_TASKS = gql`
  query GetTasks($tenantId: String!) {
    tasks(tenantId: $tenantId) {
      id
      title
      description
      status
      dueDate
      scheduledDate
      completionDate
      priority
      isRecurring
      assignedTo {
        id
        name
      }
      createdBy {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_TASK = gql`
  query GetTask($id: Int!) {
    task(id: $id) {
      id
      title
      description
      status
      dueDate
      scheduledDate
      completionDate
      priority
      isRecurring
      assignedTo {
        id
        name
      }
      createdBy {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_TASK = gql`
  mutation CreateTask(
    $title: String!
    $description: String
    $status: TaskStatus!
    $dueDate: String
    $scheduledDate: String
    $completionDate: String
    $priority: Priority
    $isRecurring: Boolean
    $assignedToId: Int
    $tenantId: String!
    $createdById: Int!
  ) {
    createTask(input: {
      title: $title
      description: $description
      status: $status
      dueDate: $dueDate
      scheduledDate: $scheduledDate
      completionDate: $completionDate
      priority: $priority
      isRecurring: $isRecurring
      assignedToId: $assignedToId
      tenantId: $tenantId
      createdById: $createdById
    }) {
      id
      title
      description
      status
      dueDate
      scheduledDate
      completionDate
      priority
      isRecurring
      assignedTo {
        id
        name
      }
      createdBy {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation UpdateTask($input: UpdateTaskInput!) {
    updateTask(input: $input) {
      id
      title
      description
      status
      dueDate
      scheduledDate
      completionDate
      priority
      isRecurring
      assignedTo {
        id
        name
      }
      createdBy {
        id
        name
      }
      updatedAt
    }
  }
`;

export const DELETE_TASK = gql`
  mutation DeleteTask($id: Int!) {
    deleteTask(id: $id)
  }
`;

export const TASK_SUBSCRIPTION = gql`
  subscription OnTaskUpdate($tenantId: String!) {
    taskUpdated(tenantId: $tenantId) {
      id
      title
      description
      status
      dueDate
      scheduledDate
      completionDate
      priority
      isRecurring
      assignedTo {
        id
        name
      }
      createdBy {
        id
        name
      }
      updatedAt
    }
  }
`; 