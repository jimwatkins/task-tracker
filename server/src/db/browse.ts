import { DynamoDBClient, ScanCommand, QueryCommand, PutItemCommand, DeleteItemCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { TABLES } from './dynamodb';
import readline from 'readline';

const client = new DynamoDBClient({
  region: 'local',
  endpoint: 'http://localhost:8000',
  credentials: {
    accessKeyId: 'dummy',
    secretAccessKey: 'dummy',
  },
});

const docClient = DynamoDBDocumentClient.from(client);
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function listUsers() {
  const command = new ScanCommand({ TableName: TABLES.USERS });
  const response = await docClient.send(command);
  console.log('Users:', JSON.stringify(response.Items, null, 2));
}

async function listTasks() {
  const command = new ScanCommand({ TableName: TABLES.TASKS });
  const response = await docClient.send(command);
  console.log('Tasks:', JSON.stringify(response.Items, null, 2));
}

async function addUser() {
  const id = await question('Enter user ID: ');
  const name = await question('Enter name: ');
  const email = await question('Enter email: ');
  const role = await question('Enter role (ADMIN/MANAGER/USER): ');
  const tenantId = await question('Enter tenant ID: ');

  const command = new PutItemCommand({
    TableName: TABLES.USERS,
    Item: {
      id: { S: id },
      name: { S: name },
      email: { S: email },
      role: { S: role },
      tenantId: { S: tenantId }
    }
  });

  await docClient.send(command);
  console.log('User added successfully!');
}

async function addTask() {
  const id = parseInt(await question('Enter task ID: '));
  const title = await question('Enter title: ');
  const description = await question('Enter description: ');
  const status = await question('Enter status (NOT_STARTED/IN_PROGRESS/COMPLETED): ');
  const dueDate = await question('Enter due date (YYYY-MM-DD): ');
  const assignedToId = parseInt(await question('Enter assigned user ID: '));
  const createdById = parseInt(await question('Enter creator user ID: '));
  const tenantId = await question('Enter tenant ID: ');

  const now = new Date().toISOString();
  const command = new PutItemCommand({
    TableName: TABLES.TASKS,
    Item: {
      id: { N: id.toString() },
      title: { S: title },
      description: { S: description },
      status: { S: status },
      dueDate: { S: dueDate },
      assignedToId: { N: assignedToId.toString() },
      createdById: { N: createdById.toString() },
      tenantId: { S: tenantId },
      createdAt: { S: now },
      updatedAt: { S: now }
    }
  });

  await docClient.send(command);
  console.log('Task added successfully!');
}

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function showMenu() {
  console.log('\nDynamoDB Browser');
  console.log('1. List Users');
  console.log('2. List Tasks');
  console.log('3. Add User');
  console.log('4. Add Task');
  console.log('5. Exit');

  const choice = await question('\nEnter your choice (1-5): ');

  switch (choice) {
    case '1':
      await listUsers();
      break;
    case '2':
      await listTasks();
      break;
    case '3':
      await addUser();
      break;
    case '4':
      await addTask();
      break;
    case '5':
      rl.close();
      process.exit(0);
    default:
      console.log('Invalid choice!');
  }

  await showMenu();
}

showMenu().catch(console.error); 