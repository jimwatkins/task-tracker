import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const isLocal = process.env.NODE_ENV === 'development';

const client = new DynamoDBClient({
  region: 'local',
  endpoint: isLocal ? 'http://localhost:8000' : undefined,
  credentials: {
    accessKeyId: 'dummy',
    secretAccessKey: 'dummy',
  },
});

export const docClient = DynamoDBDocumentClient.from(client);

// Table names
export const TABLES = {
  TASKS: 'Tasks',
  USERS: 'Users',
} as const; 