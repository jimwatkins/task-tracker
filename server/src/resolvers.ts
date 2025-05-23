import { Task, User, CreateTaskInput, UpdateTaskInput, Priority } from './types';
import { TABLES } from './db/dynamodb'; // Keep TABLES import
import { ScanCommand, QueryCommand, GetCommand, PutCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
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

const docClient = DynamoDBDocumentClient.from(client); // Use the local docClient

export const resolvers: IResolvers = {
  Query: {
    tasks: async (_: any, { tenantId }: { tenantId: string }) => {
      console.log(`[Tasks Resolver] Fetching tasks for tenant: ${tenantId}`);

      try {
        const command = new QueryCommand({
          TableName: TABLES.TASKS,
          IndexName: 'TenantIndex',
          KeyConditionExpression: '#tenantId = :tenantId',
          ExpressionAttributeNames: {
            '#tenantId': 'tenantId',
          },
          ExpressionAttributeValues: {
            ':tenantId': tenantId,
          },
        });

        const response = await docClient.send(command);
        let tasks = response.Items as Task[] || [];

        console.log(`[Tasks Resolver] Found ${tasks.length} raw tasks for tenant: ${tenantId}`);

        // Fetch associated User objects for createdBy and assignedTo
        tasks = await Promise.all(tasks.map(async (task) => {
          console.log(`[Tasks Resolver] Resolving users for task ID: ${task.id}, createdById: ${task.createdById}, assignedToId: ${task.assignedToId}`);

          // Fetch createdBy User
          const createdByUserCommand = new GetCommand({
            TableName: TABLES.USERS,
            Key: { id: task.createdById },
          });
          const createdByUserResponse = await docClient.send(createdByUserCommand);
          const createdBy = createdByUserResponse.Item as User | undefined;

          if (!createdBy) {
            console.error(`[Tasks Resolver ERROR] createdBy user with ID ${task.createdById} not found for task ${task.id}`);
          }

          // Fetch assignedTo User (if assignedToId exists)
          let assignedTo: User | undefined | null = null;
          if (task.assignedToId) {
            const assignedToUserCommand = new GetCommand({
              TableName: TABLES.USERS,
              Key: { id: task.assignedToId },
            });
            const assignedToUserResponse = await docClient.send(assignedToUserCommand);
            assignedTo = assignedToUserResponse.Item as User | undefined;

            if (task.assignedToId && !assignedTo) {
              console.warn(`[Tasks Resolver WARNING] assignedTo user with ID ${task.assignedToId} not found for task ${task.id}`);
            }
          }

          return { 
            ...task,
            createdBy: createdBy,
            assignedTo: assignedTo,
            scheduledDate: task.scheduledDate || null,
            completionDate: task.completionDate || null,
            priority: task.priority || null,
            isRecurring: task.isRecurring || false,
          } as Task;
        }));

        console.log(`[Tasks Resolver] Returning ${tasks.length} tasks with resolved users for tenant: ${tenantId}`);
        return tasks;
      } catch (error) {
        console.error('[Tasks Resolver ERROR] Error fetching tasks from DynamoDB and resolving users:', error);
        throw new Error('Failed to fetch tasks with users.');
      }
    },
    task: async (_: any, { id }: { id: number }) => {
      console.log(`[Task Resolver] Fetching task with ID: ${id}`);
      try {
        const command = new GetCommand({
          TableName: TABLES.TASKS,
          Key: {
            id: Number(id), // Ensure ID is a number
          },
        });

        const response = await docClient.send(command);
        const task = response.Item as Task | undefined;

        if (!task) {
          console.log(`[Task Resolver] Task with ID ${id} not found.`);
          return null;
        }

        console.log(`[Task Resolver] Found raw task: ${task.title}`);

        // Fetch createdBy User
        const createdByUserCommand = new GetCommand({
          TableName: TABLES.USERS,
          Key: { id: Number(task.createdById) }, // Ensure ID is a number
        });
        const createdByUserResponse = await docClient.send(createdByUserCommand);
        const createdBy = createdByUserResponse.Item as User | undefined;

        // Fetch assignedTo User (if assignedToId exists)
        let assignedTo: User | undefined | null = null;
        if (task.assignedToId != null) {
          const assignedToUserCommand = new GetCommand({
            TableName: TABLES.USERS,
            Key: { id: Number(task.assignedToId) }, // Ensure ID is a number
          });
          const assignedToUserResponse = await docClient.send(assignedToUserCommand);
          assignedTo = assignedToUserResponse.Item as User | undefined;
        }

        if (!createdBy) {
          console.error(`[Task Resolver ERROR] createdBy user with ID ${task.createdById} not found for task ${task.id}`);
        }

        console.log(`[Task Resolver] Returning task with resolved users and new fields for ID: ${id}`);
        return { 
          ...task,
          createdBy: createdBy,
          assignedTo: assignedTo,
          scheduledDate: task.scheduledDate || null,
          completionDate: task.completionDate || null,
          priority: task.priority || null,
          isRecurring: task.isRecurring || false,
        } as Task;
      } catch (error) {
        console.error(`[Task Resolver ERROR] Error fetching task with ID ${id} from DynamoDB and resolving users:`, error);
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
            ':tenantId': tenantId,
          },
        });

        const response = await docClient.send(command);
        console.log('[Users Resolver] DynamoDB Query Response (Users):', JSON.stringify(response, null, 2));

        // Convert string ID to number (still needed as QueryCommand might return as strings)
        const users = (response.Items as User[] || []).map(user => ({
          ...user,
          id: typeof user.id === 'string' ? parseInt(user.id) : user.id
        }));

        console.log(`[Users Resolver] Found ${users.length} users for tenant: ${tenantId}`);
        return users;
      } catch (error) {
        console.error('[Users Resolver ERROR] Error fetching users from DynamoDB:', error);
        throw new Error('Failed to fetch users.');
      }
    },
    user: async (_: any, { id }: { id: number }) => {
      console.log(`[User Resolver] Fetching user with ID: ${id}`);
      try {
        const command = new GetCommand({
          TableName: TABLES.USERS,
          Key: {
            id: id, // Pass number ID directly
          },
        });

        const response = await docClient.send(command);
        console.log('[User Resolver] DynamoDB Get Response (User):', JSON.stringify(response, null, 2));

        const user = response.Item as User | undefined;

        if (!user) {
          console.log(`[User Resolver] User with ID ${id} not found.`);
          return null;
        }

        // Convert string ID to number for consistency if needed
         const userWithNumericId = {
          ...user,
          id: typeof user.id === 'string' ? parseInt(user.id) : user.id,
        };

        console.log(`[User Resolver] Found user: ${userWithNumericId.name}`);
        return userWithNumericId;
      } catch (error) {
        console.error(`[User Resolver ERROR] Error fetching user with ID ${id} from DynamoDB:`, error);
        throw new Error('Failed to fetch user.');
      }
    },
  },

  Mutation: {
    createTask: async (_: any, { input }: { input: CreateTaskInput }) => {
      console.log('[createTask Mutation] Creating task:', input);
      try {
        // Get the next available ID by scanning the table
        // Note: This approach has potential race conditions in a high-concurrency environment.
        // A better approach would involve using a dedicated counter table or DynamoDB sequences.
        const scanCommand = new ScanCommand({
          TableName: TABLES.TASKS,
          ProjectionExpression: 'id',
        });
        const scanResponse = await docClient.send(scanCommand);
        const existingIds = (scanResponse.Items || []).map(item => item.id);
        const taskId = Math.max(0, ...existingIds) + 1;

        const now = new Date().toISOString();

        // Fetch the createdBy user to include in the response
        const createdByUserCommand = new GetCommand({
          TableName: TABLES.USERS,
          Key: { id: input.createdById },
        });
        const createdByUserResponse = await docClient.send(createdByUserCommand);
        const createdBy = createdByUserResponse.Item as User | undefined;

        if (!createdBy) {
          console.error(`[createTask Mutation ERROR] Creator user with ID ${input.createdById} not found.`);
          throw new Error(`Creator user with ID ${input.createdById} not found.`);
        }

        // Include new fields in the task object
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
          tenantId: input.tenantId,
          createdById: input.createdById,
          createdAt: now,
          updatedAt: now,
        };

        const command = new PutCommand({
          TableName: TABLES.TASKS,
          Item: newTask,
        });

        await docClient.send(command);
        console.log(`[createTask Mutation] Task created successfully with ID: ${taskId}`);

        return { ...newTask, createdBy: createdBy, assignedTo: null } as Task;
      } catch (error) {
        console.error('[createTask Mutation ERROR] Error creating task in DynamoDB:', error);
        throw new Error('Failed to create task.');
      }
    },
    updateTask: async (_: any, { input }: { input: UpdateTaskInput }) => {
      console.log('[updateTask Mutation] Updating task:', input);
      const { id, title, description, status, dueDate, scheduledDate, completionDate, priority, isRecurring, assignedToId } = input;
      const now = new Date().toISOString();

      const updateExpressionParts: string[] = [];
      const expressionAttributeNames: Record<string, string> = {};
      const expressionAttributeValues: Record<string, any> = {};

      // Helper to add update expression part if value is defined (and not null for non-nullable fields)
      const addUpdate = (fieldName: string, value: any, attributeName: string) => {
          // Check for explicit null for nullable fields to use REMOVE
          if (value === null) {
              updateExpressionParts.push(`REMOVE #${attributeName}`);
              expressionAttributeNames[`#${attributeName}`] = fieldName;
          } else if (value !== undefined) { // Check for undefined to know if the field was provided in the input
               updateExpressionParts.push(`SET #${attributeName} = :${attributeName}`);
               expressionAttributeNames[`#${attributeName}`] = fieldName;
               expressionAttributeValues[`:${attributeName}`] = value;
          }
      };

      addUpdate('title', title, 'title');
      addUpdate('description', description, 'description');
      addUpdate('status', status, 'status');
      addUpdate('dueDate', dueDate, 'dueDate');
      addUpdate('scheduledDate', scheduledDate, 'scheduledDate');
      addUpdate('completionDate', completionDate, 'completionDate');
      addUpdate('priority', priority, 'priority');
      // isRecurring is boolean, handle undefined/null specifically if needed
      if (isRecurring !== undefined) {
           if (isRecurring === null) { // Treat null as removing the attribute
             updateExpressionParts.push('REMOVE #isRecurring');
             expressionAttributeNames['#isRecurring'] = 'isRecurring';
           } else {
              updateExpressionParts.push('SET #isRecurring = :isRecurring');
              expressionAttributeNames['#isRecurring'] = 'isRecurring';
              expressionAttributeValues[':isRecurring'] = isRecurring;
           }
      }

      if (assignedToId !== undefined) {
          if (assignedToId === null) {
              // If assignedToId is set to null, remove the attribute
               updateExpressionParts.push('REMOVE #assignedToId');
               expressionAttributeNames['#assignedToId'] = 'assignedToId';
          } else {
             // Ensure the assignedToId exists as a user before attempting to assign
              const assignedToUserCommand = new GetCommand({
                TableName: TABLES.USERS,
                Key: { id: assignedToId },
              });
              const assignedToUserResponse = await docClient.send(assignedToUserCommand);
              const assignedToUser = assignedToUserResponse.Item as User | undefined;

              if (!assignedToUser) {
                console.error(`[updateTask Mutation ERROR] AssignedTo user with ID ${assignedToId} not found.`);
                throw new Error(`AssignedTo user with ID ${assignedToId} not found.`);
              }
            updateExpressionParts.push('SET #assignedToId = :assignedToId');
            expressionAttributeNames['#assignedToId'] = 'assignedToId';
            expressionAttributeValues[':assignedToId'] = assignedToId;
          }
      }

      // Add updatedAt timestamp
      updateExpressionParts.push('#updatedAt = :updatedAt');
      expressionAttributeNames['#updatedAt'] = 'updatedAt';
      expressionAttributeValues[':updatedAt'] = now;

      // Only proceed if there are fields to update
      if (Object.keys(expressionAttributeNames).length === 1 && expressionAttributeNames['#updatedAt'] === 'updatedAt') { // Check if only updatedAt is being updated
           console.warn(`[updateTask Mutation] No updatable fields provided for task ID ${id}. Only updatedAt will be updated.`);
           // Proceed with update, but maybe return the existing task instead? Or just the updated timestamp?
           // For now, proceed with update and return ALL_NEW
      }

      const updateExpression = 'SET ' + updateExpressionParts.join(', ');

      try {
        const command = new UpdateCommand({
          TableName: TABLES.TASKS,
          Key: {
            id: id,
          },
          UpdateExpression: updateExpression,
          ExpressionAttributeNames: expressionAttributeNames,
          ExpressionAttributeValues: expressionAttributeValues,
          ReturnValues: 'ALL_NEW', // Return the updated item
        });

        const response = await docClient.send(command);
        console.log('[updateTask Mutation] DynamoDB Update Response:', JSON.stringify(response, null, 2));

        const updatedTask = response.Attributes as Task | undefined;

        if (!updatedTask) {
             // This case should ideally not happen if ReturnValues is ALL_NEW and the key exists
             throw new Error(`[updateTask Mutation ERROR] Task with ID ${id} not found after update.`);
        }
         // Fetch createdBy and assignedTo for the updated task before returning
            const createdByUserCommand = new GetCommand({
                TableName: TABLES.USERS,
                Key: { id: updatedTask.createdById },
            });
            const createdByUserResponse = await docClient.send(createdByUserCommand);
            const createdBy = createdByUserResponse.Item as User | undefined;

            let assignedTo: User | undefined | null = null;
             if (updatedTask.assignedToId != null) {
                const assignedToUserCommand = new GetCommand({
                  TableName: TABLES.USERS,
                  Key: { id: updatedTask.assignedToId },
                });
                const assignedToUserResponse = await docClient.send(assignedToUserCommand);
                assignedTo = assignedToUserResponse.Item as User | undefined;
            }

        console.log(`[updateTask Mutation] Task updated successfully with ID: ${id}`);
        // Include new fields in the returned task
        return { 
            ...updatedTask,
            createdBy: createdBy,
            assignedTo: assignedTo,
            scheduledDate: updatedTask.scheduledDate || null,
            completionDate: updatedTask.completionDate || null,
            priority: updatedTask.priority || null,
            isRecurring: updatedTask.isRecurring || false,
        } as Task;
      } catch (error) {
        console.error(`[updateTask Mutation ERROR] Error updating task with ID ${id} from DynamoDB:`, error);
        throw new Error('Failed to update task.');
      }
    },
    deleteTask: async (_: any, { id }: { id: number }) => { // Change ID type to number
      console.log(`[deleteTask Mutation] Deleting task with ID: ${id}`);
      try {
         // Optional: Check if task exists before attempting deletion
         const getCommand = new GetCommand({
             TableName: TABLES.TASKS,
             Key: { id: id } // Pass number ID directly
         });
         const getResponse = await docClient.send(getCommand);
         if (!getResponse.Item) {
             console.warn(`[deleteTask Mutation WARNING] Task with ID ${id} not found for deletion.`);
             return false; // Indicate not found or already deleted
         }

        const command = new DeleteCommand({
          TableName: TABLES.TASKS,
          Key: {
            id: id, // Pass number ID directly
          },
        });

        await docClient.send(command);
        console.log(`[deleteTask Mutation] Task deleted successfully with ID: ${id}`);
        return true; // Indicate successful deletion
      } catch (error) {
        console.error(`[deleteTask Mutation ERROR] Error deleting task with ID ${id} from DynamoDB:`, error);
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