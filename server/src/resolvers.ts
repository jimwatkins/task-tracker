import { Task, User, CreateTaskInput, UpdateTaskInput, Priority } from './types';
import { TABLES } from './db/dynamodb';
import { 
  ScanCommand, 
  QueryCommand, 
  GetItemCommand, 
  PutItemCommand, 
  UpdateItemCommand, 
  DeleteItemCommand,
  AttributeValue
} from '@aws-sdk/client-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { IResolvers } from '@graphql-tools/utils';

const client = new DynamoDBClient({
  region: 'local',
  endpoint: 'http://localhost:8000',
  credentials: {
    accessKeyId: 'dummy',
    secretAccessKey: 'dummy',
  },
});

// Helper function to convert JavaScript values to DynamoDB AttributeValue
const toDynamoDBValue = (value: any): AttributeValue => {
  if (typeof value === 'number') {
    return { N: value.toString() };
  }
  if (typeof value === 'string') {
    return { S: value };
  }
  if (typeof value === 'boolean') {
    return { BOOL: value };
  }
  if (value === null || value === undefined) {
    return { NULL: true };
  }
  if (Array.isArray(value)) {
    return { L: value.map(toDynamoDBValue) };
  }
  if (typeof value === 'object') {
    return { M: Object.fromEntries(Object.entries(value).map(([k, v]) => [k, toDynamoDBValue(v)])) };
  }
  throw new Error(`Unsupported value type: ${typeof value}`);
};

// Helper function to convert DynamoDB item to Task
const convertDynamoItemToTask = (item: Record<string, AttributeValue>): Task => {
  return {
    id: Number(item.id.N),
    title: item.title.S!,
    description: item.description?.S || null,
    status: item.status.S!,
    dueDate: item.dueDate?.S || null,
    scheduledDate: item.scheduledDate?.S || null,
    completionDate: item.completionDate?.S || null,
    priority: item.priority?.S || null,
    isRecurring: item.isRecurring?.BOOL || false,
    assignedToId: item.assignedToId ? Number(item.assignedToId.N) : null,
    createdById: Number(item.createdById.N),
    tenantId: item.tenantId.S!,
    createdAt: item.createdAt.S!,
    updatedAt: item.updatedAt.S!,
  } as Task;
};

// Helper function to convert DynamoDB item to User
const convertDynamoItemToUser = (item: Record<string, AttributeValue>): User => {
  return {
    id: Number(item.id.N),
    name: item.name.S!,
    email: item.email.S!,
    role: item.role.S!,
    tenantId: item.tenantId.S!,
  } as User;
};

export const resolvers: IResolvers = {
  Query: {
    tasks: async (_: any, { tenantId }: { tenantId: string }) => {
      console.log(`[Tasks Resolver] Starting task fetch for tenant: ${tenantId}`);

      try {
        console.log('[Tasks Resolver] Building QueryCommand with params:', {
          TableName: TABLES.TASKS,
          IndexName: 'TenantIndex',
          KeyConditionExpression: '#tenantId = :tenantId',
          ExpressionAttributeNames: {
            '#tenantId': 'tenantId',
          },
          ExpressionAttributeValues: {
            ':tenantId': toDynamoDBValue(tenantId),
          },
        });

        const command = new QueryCommand({
          TableName: TABLES.TASKS,
          IndexName: 'TenantIndex',
          KeyConditionExpression: '#tenantId = :tenantId',
          ExpressionAttributeNames: {
            '#tenantId': 'tenantId',
          },
          ExpressionAttributeValues: {
            ':tenantId': toDynamoDBValue(tenantId),
          },
        });

        console.log('[Tasks Resolver] Sending QueryCommand to DynamoDB...');
        const response = await client.send(command);
        console.log('[Tasks Resolver] Raw DynamoDB response:', JSON.stringify(response, null, 2));

        if (!response.Items || response.Items.length === 0) {
          console.log('[Tasks Resolver] No tasks found in DynamoDB response');
          return [];
        }

        console.log(`[Tasks Resolver] Found ${response.Items.length} raw items in DynamoDB response`);
        let tasks = (response.Items || []).map(item => {
          console.log('[Tasks Resolver] Converting DynamoDB item to Task:', JSON.stringify(item, null, 2));
          const task = convertDynamoItemToTask(item);
          console.log('[Tasks Resolver] Converted Task:', JSON.stringify(task, null, 2));
          return task;
        });

        console.log(`[Tasks Resolver] Successfully converted ${tasks.length} tasks`);

        // Fetch associated User objects for createdBy and assignedTo
        console.log('[Tasks Resolver] Starting user resolution for tasks');
        tasks = await Promise.all(tasks.map(async (task) => {
          console.log(`[Tasks Resolver] Resolving users for task ID: ${task.id}, createdById: ${task.createdById}, assignedToId: ${task.assignedToId}`);

          // Fetch createdBy User
          console.log(`[Tasks Resolver] Fetching createdBy user with ID: ${task.createdById}`);
          const createdByUserCommand = new GetItemCommand({
            TableName: TABLES.USERS,
            Key: { id: toDynamoDBValue(task.createdById) },
          });
          console.log('[Tasks Resolver] CreatedBy GetItemCommand params:', JSON.stringify(createdByUserCommand.input, null, 2));
          
          const createdByUserResponse = await client.send(createdByUserCommand);
          console.log('[Tasks Resolver] CreatedBy DynamoDB response:', JSON.stringify(createdByUserResponse, null, 2));
          
          const createdBy = createdByUserResponse.Item ? convertDynamoItemToUser(createdByUserResponse.Item) : undefined;
          console.log('[Tasks Resolver] Converted createdBy user:', JSON.stringify(createdBy, null, 2));

          if (!createdBy) {
            console.error(`[Tasks Resolver ERROR] createdBy user with ID ${task.createdById} not found for task ${task.id}`);
          }

          // Fetch assignedTo User (if assignedToId exists)
          let assignedTo: User | undefined | null = null;
          if (task.assignedToId) {
            console.log(`[Tasks Resolver] Fetching assignedTo user with ID: ${task.assignedToId}`);
            const assignedToUserCommand = new GetItemCommand({
              TableName: TABLES.USERS,
              Key: { id: toDynamoDBValue(task.assignedToId) },
            });
            console.log('[Tasks Resolver] AssignedTo GetItemCommand params:', JSON.stringify(assignedToUserCommand.input, null, 2));
            
            const assignedToUserResponse = await client.send(assignedToUserCommand);
            console.log('[Tasks Resolver] AssignedTo DynamoDB response:', JSON.stringify(assignedToUserResponse, null, 2));
            
            assignedTo = assignedToUserResponse.Item ? convertDynamoItemToUser(assignedToUserResponse.Item) : undefined;
            console.log('[Tasks Resolver] Converted assignedTo user:', JSON.stringify(assignedTo, null, 2));

            if (!assignedTo) {
              console.warn(`[Tasks Resolver WARNING] assignedTo user with ID ${task.assignedToId} not found for task ${task.id}`);
            }
          }

          const finalTask = { 
            ...task,
            createdBy: createdBy,
            assignedTo: assignedTo,
          } as Task;
          console.log('[Tasks Resolver] Final task with resolved users:', JSON.stringify(finalTask, null, 2));
          return finalTask;
        }));

        console.log(`[Tasks Resolver] Successfully resolved all users for ${tasks.length} tasks`);
        return tasks;
      } catch (error) {
        console.error('[Tasks Resolver ERROR] Error details:', {
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
          error: error
        });
        throw new Error('Failed to fetch tasks with users.');
      }
    },
    task: async (_: any, { id }: { id: number }) => {
      // Temporary error test
      if (id === 999) {
        throw new Error('Test error: This is a simulated server error');
      }
      
      console.log(`[Task Resolver] Fetching task with ID: ${id}`);
      try {
        const command = new GetItemCommand({
          TableName: TABLES.TASKS,
          Key: {
            id: toDynamoDBValue(id),
          },
        });

        const response = await client.send(command);
        console.log('[Task Resolver] DynamoDB Get Response:', JSON.stringify(response, null, 2));

        if (!response.Item) {
          console.warn(`[Task Resolver WARNING] Task with ID ${id} not found.`);
          return null;
        }

        const task = convertDynamoItemToTask(response.Item);
        console.log(`[Task Resolver] Converted task:`, task);

        // Fetch createdBy User
        console.log(`[Task Resolver] Fetching createdBy user with ID: ${task.createdById}`);
        const createdByUserCommand = new GetItemCommand({
          TableName: TABLES.USERS,
          Key: { id: toDynamoDBValue(task.createdById) },
        });
        const createdByUserResponse = await client.send(createdByUserCommand);
        const createdBy = createdByUserResponse.Item ? convertDynamoItemToUser(createdByUserResponse.Item) : undefined;

        if (!createdBy) {
          console.error(`[Task Resolver ERROR] createdBy user with ID ${task.createdById} not found for task ${task.id}`);
          throw new Error(`User with ID ${task.createdById} not found.`);
        }

        // Fetch assignedTo User (if assignedToId exists)
        let assignedTo: User | undefined | null = null;
        if (task.assignedToId) {
          console.log(`[Task Resolver] Fetching assignedTo user with ID: ${task.assignedToId}`);
          const assignedToUserCommand = new GetItemCommand({
            TableName: TABLES.USERS,
            Key: { id: toDynamoDBValue(task.assignedToId) },
          });
          const assignedToUserResponse = await client.send(assignedToUserCommand);
          assignedTo = assignedToUserResponse.Item ? convertDynamoItemToUser(assignedToUserResponse.Item) : undefined;

          if (!assignedTo) {
            console.warn(`[Task Resolver WARNING] assignedTo user with ID ${task.assignedToId} not found for task ${task.id}`);
          }
        }

        const finalTask = {
          ...task,
          createdBy,
          assignedTo,
        };

        console.log(`[Task Resolver] Returning task with resolved users:`, finalTask);
        return finalTask;
      } catch (error) {
        console.error('[Task Resolver ERROR] Error fetching task from DynamoDB:', error);
        throw new Error('Failed to fetch task.');
      }
    },
    users: async (_: any, { tenantId }: { tenantId: string }) => {
      console.log(`[Users Resolver] Fetching users for tenant: ${tenantId}`);
      try {
        const command = new QueryCommand({
          TableName: TABLES.USERS,
          IndexName: 'TenantIndex',
          KeyConditionExpression: '#tenantId = :tenantId',
          ExpressionAttributeNames: {
            '#tenantId': 'tenantId',
          },
          ExpressionAttributeValues: {
            ':tenantId': toDynamoDBValue(tenantId),
          },
        });

        const response = await client.send(command);
        console.log('[Users Resolver] DynamoDB Query Response (Users):', JSON.stringify(response, null, 2));

        const users = (response.Items || []).map(convertDynamoItemToUser);
        console.log(`[Users Resolver] Returning ${users.length} users for tenant: ${tenantId}`);
        return users;
      } catch (error) {
        console.error('[Users Resolver ERROR] Error fetching users from DynamoDB:', error);
        throw new Error('Failed to fetch users.');
      }
    },
    user: async (_: any, { id }: { id: number }) => {
      console.log(`[User Resolver] Fetching user with ID: ${id}`);
      try {
        const command = new GetItemCommand({
          TableName: TABLES.USERS,
          Key: {
            id: toDynamoDBValue(id),
          },
        });

        const response = await client.send(command);
        console.log('[User Resolver] DynamoDB Get Response (User):', JSON.stringify(response, null, 2));

        if (!response.Item) {
          console.warn(`[User Resolver WARNING] User with ID ${id} not found.`);
          return null;
        }

        const user = convertDynamoItemToUser(response.Item);
        console.log(`[User Resolver] Returning user:`, user);
        return user;
      } catch (error) {
        console.error('[User Resolver ERROR] Error fetching user from DynamoDB:', error);
        throw new Error('Failed to fetch user.');
      }
    },
  },

  Mutation: {
    createTask: async (_: any, { input }: { input: CreateTaskInput }) => {
      console.log('[createTask Mutation] Input:', input);
      try {
        // Generate a new task ID
        const scanCommand = new ScanCommand({
          TableName: TABLES.TASKS,
          ProjectionExpression: 'id',
        });
        const scanResponse = await client.send(scanCommand);
        const existingIds = (scanResponse.Items || []).map(item => Number(item.id.N));
        const taskId = Math.max(0, ...existingIds) + 1;

        // Fetch the createdBy user to include in the response
        const createdByUserCommand = new GetItemCommand({
          TableName: TABLES.USERS,
          Key: { id: toDynamoDBValue(input.createdById) },
        });
        const createdByUserResponse = await client.send(createdByUserCommand);
        const createdBy = createdByUserResponse.Item ? convertDynamoItemToUser(createdByUserResponse.Item) : undefined;

        if (!createdBy) {
          throw new Error(`User with ID ${input.createdById} not found.`);
        }

        const now = new Date().toISOString();
        const newTask = {
          id: taskId,
          title: input.title,
          description: input.description || null,
          status: input.status,
          dueDate: input.dueDate || null,
          scheduledDate: input.scheduledDate || null,
          completionDate: null,
          priority: input.priority || null,
          isRecurring: input.isRecurring || false,
          assignedToId: input.assignedToId || null,
          createdById: input.createdById,
          tenantId: input.tenantId,
          createdAt: now,
          updatedAt: now,
        };

        const command = new PutItemCommand({
          TableName: TABLES.TASKS,
          Item: Object.fromEntries(
            Object.entries(newTask).map(([key, value]) => [key, toDynamoDBValue(value)])
          ),
        });

        await client.send(command);
        console.log(`[createTask Mutation] Task created successfully with ID: ${taskId}`);

        // Fetch assignedTo user if assignedToId is provided
        let assignedTo: User | undefined | null = null;
        if (input.assignedToId) {
          const assignedToUserCommand = new GetItemCommand({
            TableName: TABLES.USERS,
            Key: { id: toDynamoDBValue(input.assignedToId) },
          });
          const assignedToUserResponse = await client.send(assignedToUserCommand);
          assignedTo = assignedToUserResponse.Item ? convertDynamoItemToUser(assignedToUserResponse.Item) : undefined;

          if (!assignedTo) {
            console.warn(`[createTask Mutation WARNING] assignedTo user with ID ${input.assignedToId} not found.`);
          }
        }

        return {
          ...newTask,
          createdBy: createdBy,
          assignedTo: assignedTo,
        } as Task;
      } catch (error) {
        console.error('[createTask Mutation ERROR] Error creating task:', error);
        throw new Error('Failed to create task.');
      }
    },
    updateTask: async (_: any, { input }: { input: UpdateTaskInput }) => {
      console.log(`[updateTask Mutation] Updating task with input:`, input);
      try {
        // First, get the current task to ensure it exists and to get the current values
        const getCommand = new GetItemCommand({
          TableName: TABLES.TASKS,
          Key: {
            id: toDynamoDBValue(input.id),
          },
        });

        const getResponse = await client.send(getCommand);
        if (!getResponse.Item) {
          throw new Error(`Task with ID ${input.id} not found.`);
        }

        const currentTask = convertDynamoItemToTask(getResponse.Item);
        const now = new Date().toISOString();

        // Prepare the update expression and attribute values
        const updateExpressions: string[] = [];
        const expressionAttributeNames: Record<string, string> = {};
        const expressionAttributeValues: Record<string, AttributeValue> = {};

        // Helper function to add an update expression
        const addUpdateExpression = (key: string, value: any) => {
          const attributeName = `#${key}`;
          const attributeValue = `:${key}`;
          expressionAttributeNames[attributeName] = key;
          expressionAttributeValues[attributeValue] = toDynamoDBValue(value);
          updateExpressions.push(`${attributeName} = ${attributeValue}`);
        };

        // Add update expressions for each field that is provided in the input
        if (input.title !== undefined) addUpdateExpression('title', input.title);
        if (input.description !== undefined) addUpdateExpression('description', input.description);
        if (input.status !== undefined) addUpdateExpression('status', input.status);
        if (input.dueDate !== undefined) addUpdateExpression('dueDate', input.dueDate);
        if (input.scheduledDate !== undefined) addUpdateExpression('scheduledDate', input.scheduledDate);
        if (input.completionDate !== undefined) addUpdateExpression('completionDate', input.completionDate);
        if (input.priority !== undefined) addUpdateExpression('priority', input.priority);
        if (input.isRecurring !== undefined) addUpdateExpression('isRecurring', input.isRecurring);
        if (input.assignedToId !== undefined) addUpdateExpression('assignedToId', input.assignedToId);
        addUpdateExpression('updatedAt', now);

        const command = new UpdateItemCommand({
          TableName: TABLES.TASKS,
          Key: {
            id: toDynamoDBValue(input.id),
          },
          UpdateExpression: `SET ${updateExpressions.join(', ')}`,
          ExpressionAttributeNames: expressionAttributeNames,
          ExpressionAttributeValues: expressionAttributeValues,
          ReturnValues: 'ALL_NEW',
        });

        const response = await client.send(command);
        console.log('[updateTask Mutation] DynamoDB Update Response:', JSON.stringify(response, null, 2));

        if (!response.Attributes) {
          throw new Error('Failed to update task.');
        }

        const updatedTask = convertDynamoItemToTask(response.Attributes);

        // Fetch createdBy and assignedTo for the updated task before returning
        const createdByUserCommand = new GetItemCommand({
          TableName: TABLES.USERS,
          Key: { id: toDynamoDBValue(updatedTask.createdById) },
        });
        const createdByUserResponse = await client.send(createdByUserCommand);
        const createdBy = createdByUserResponse.Item ? convertDynamoItemToUser(createdByUserResponse.Item) : undefined;

        let assignedTo: User | undefined | null = null;
        if (updatedTask.assignedToId != null) {
          const assignedToUserCommand = new GetItemCommand({
            TableName: TABLES.USERS,
            Key: { id: toDynamoDBValue(updatedTask.assignedToId) },
          });
          const assignedToUserResponse = await client.send(assignedToUserCommand);
          assignedTo = assignedToUserResponse.Item ? convertDynamoItemToUser(assignedToUserResponse.Item) : undefined;
        }

        return {
          ...updatedTask,
          createdBy: createdBy,
          assignedTo: assignedTo,
        } as Task;
      } catch (error) {
        console.error('[updateTask Mutation ERROR] Error updating task:', error);
        throw new Error('Failed to update task.');
      }
    },
    deleteTask: async (_: any, { id }: { id: number }) => {
      console.log(`[deleteTask Mutation] Deleting task with ID: ${id}`);
      try {
        // Optional: Check if task exists before attempting deletion
        const getCommand = new GetItemCommand({
          TableName: TABLES.TASKS,
          Key: { id: toDynamoDBValue(id) },
        });
        const getResponse = await client.send(getCommand);
        if (!getResponse.Item) {
          console.warn(`[deleteTask Mutation WARNING] Task with ID ${id} not found for deletion.`);
          return false;
        }

        const command = new DeleteItemCommand({
          TableName: TABLES.TASKS,
          Key: {
            id: toDynamoDBValue(id),
          },
        });

        await client.send(command);
        console.log(`[deleteTask Mutation] Task deleted successfully with ID: ${id}`);
        return true;
      } catch (error) {
        console.error('[deleteTask Mutation ERROR] Error deleting task:', error);
        throw new Error('Failed to delete task.');
      }
    },
  },

  // Add resolver for the Priority enum (optional, but good practice)
  Priority: {
    LOW: 'LOW',
    MEDIUM: 'MEDIUM',
    HIGH: 'HIGH',
  },

  // Add resolvers for Task fields that require special handling (like User resolution)
  Task: {
    createdBy: async (task: Task) => {
      // createdBy is already resolved in the parent task query/mutation resolvers
      // This resolver is here mainly for type safety and clarity
      return task.createdBy;
    },
    assignedTo: async (task: Task) => {
       // assignedTo is already resolved in the parent task query/mutation resolvers
      // This resolver is here mainly for type safety and clarity
      return task.assignedTo;
    },
    // Add resolvers for new fields if they require formatting or special logic
    scheduledDate: (task: Task) => task.scheduledDate || null,
    completionDate: (task: Task) => task.completionDate || null,
    priority: (task: Task) => task.priority || null,
    isRecurring: (task: Task) => task.isRecurring || false,
  },
  User: { // Add a User resolver to ensure ID is number (if needed, though query/task resolvers handle this)
     id: (user: User) => typeof user.id === 'string' ? parseInt(user.id) : user.id,
  }
}; 