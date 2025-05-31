import { CreateTableCommand, DeleteTableCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { TABLES } from './dynamodb';
import { exec } from 'child_process';

const client = new DynamoDBClient({
  region: 'local',
  endpoint: 'http://localhost:8000',
  credentials: {
    accessKeyId: 'dummy',
    secretAccessKey: 'dummy',
  },
});

async function dropTables() {
  console.log('Dropping tables...');
  try {
    await client.send(new DeleteTableCommand({ TableName: TABLES.USERS }));
    console.log(`${TABLES.USERS} table dropped successfully.`);
  } catch (error: any) {
    if (error.name === 'ResourceNotFoundException') {
      console.warn(`${TABLES.USERS} table not found. Skipping drop.`);
    } else {
      console.error(`Error dropping ${TABLES.USERS} table:`, error);
      throw error; // Re-throw other errors
    }
  }

  try {
    await client.send(new DeleteTableCommand({ TableName: TABLES.TASKS }));
    console.log(`${TABLES.TASKS} table dropped successfully.`);
  } catch (error: any) {
    if (error.name === 'ResourceNotFoundException') {
      console.warn(`${TABLES.TASKS} table not found. Skipping drop.`);
    } else {
      console.error(`Error dropping ${TABLES.TASKS} table:`, error);
      throw error; // Re-throw other errors
    }
  }
  console.log('Finished dropping tables.');
}

async function createTables() {
  console.log('Creating Users table...');
  try {
    await client.send(
      new CreateTableCommand({
        TableName: TABLES.USERS,
        KeySchema: [
          { AttributeName: 'id', KeyType: 'HASH' },
        ],
        AttributeDefinitions: [
          { AttributeName: 'id', AttributeType: 'N' },
          { AttributeName: 'tenantId', AttributeType: 'S' },
        ],
        GlobalSecondaryIndexes: [
          {
            IndexName: 'TenantIndex',
            KeySchema: [
              { AttributeName: 'tenantId', KeyType: 'HASH' },
            ],
            Projection: { ProjectionType: 'ALL' },
            ProvisionedThroughput: {
              ReadCapacityUnits: 5,
              WriteCapacityUnits: 5,
            },
          },
        ],
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
      })
    );
    console.log('Users table created successfully');
  } catch (error: any) {
      if (error.name === 'ResourceInUseException') {
          console.warn('Users table already exists. Skipping creation.');
      } else {
          console.error('Error creating Users table:', error);
          throw error; // Re-throw other errors
      }
  }

  console.log('Creating Tasks table...');
  try {
      await client.send(
        new CreateTableCommand({
          TableName: TABLES.TASKS,
          KeySchema: [
            { AttributeName: 'id', KeyType: 'HASH' },
          ],
          AttributeDefinitions: [
            { AttributeName: 'id', AttributeType: 'N' },
            { AttributeName: 'tenantId', AttributeType: 'S' },
          ],
          GlobalSecondaryIndexes: [
            {
              IndexName: 'TenantIndex',
              KeySchema: [
                { AttributeName: 'tenantId', KeyType: 'HASH' },
              ],
              Projection: { ProjectionType: 'ALL' },
              ProvisionedThroughput: {
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5,
              },
            },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          },
        })
      );
      console.log('Tasks table created successfully');
  } catch (error: any) {
        if (error.name === 'ResourceInUseException') {
            console.warn('Tasks table already exists. Skipping creation.');
        } else {
            console.error('Error creating Tasks table:', error);
            throw error; // Re-throw other errors
        }
  }
}

async function init() {
  const shouldDropTables = process.argv.includes('--drop');

  if (shouldDropTables) {
    await dropTables();
  }

  try {
    await createTables();

    // Call the seed script
    console.log('Starting to seed data...');
    exec('npx ts-node src/db/seed.ts', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error seeding data: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Seed script stderr: ${stderr}`);
        return;
      }
      console.log(`Seed script stdout:\n${stdout}`);
      console.log('Data seeding finished.');
    });

  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

init(); 