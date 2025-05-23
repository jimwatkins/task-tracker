import { PutItemCommand } from '@aws-sdk/client-dynamodb';
import { docClient, TABLES } from './dynamodb';

// Define helper types for seed data
interface SeedUser {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'USER';
  tenantId: string;
}

interface SeedTask {
  id: number;
  title: string;
  description?: string | null;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  dueDate?: string | null;
  scheduledDate?: string | null;
  completionDate?: string | null;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | null;
  isRecurring?: boolean | null;
  assignedToId?: number | null;
  createdById: number;
  tenantId: string;
}

const exampleUsers: SeedUser[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'ADMIN',
    tenantId: 'tenant1'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'MANAGER',
    tenantId: 'tenant1'
  },
  {
    id: 3,
    name: 'Bob Wilson',
    email: 'bob@example.com',
    role: 'USER',
    tenantId: 'tenant1'
  }
];

const exampleTasks: SeedTask[] = [
  {
    id: 1,
    title: 'Lawn Mowing',
    description: 'Mow the front and back lawns and trim the edges.',
    status: 'COMPLETED',
    dueDate: '2024-06-10',
    scheduledDate: '2024-06-08',
    completionDate: '2024-06-10',
    priority: 'MEDIUM',
    isRecurring: true,
    assignedToId: 2,
    createdById: 1,
    tenantId: 'tenant1'
  },
  {
    id: 2,
    title: 'HVAC System Inspection',
    description: 'Annual inspection and maintenance of the HVAC system.',
    status: 'IN_PROGRESS',
    dueDate: '2024-06-15',
    scheduledDate: '2024-06-14',
    completionDate: null,
    priority: 'HIGH',
    isRecurring: false,
    assignedToId: 3,
    createdById: 1,
    tenantId: 'tenant1'
  },
  {
    id: 3,
    title: 'Roof Leak Repair',
    description: 'Fix the leak above the kitchen area and inspect for further damage.',
    status: 'NOT_STARTED',
    dueDate: '2024-06-20',
    scheduledDate: '2024-06-18',
    completionDate: null,
    priority: 'HIGH',
    isRecurring: false,
    assignedToId: 2,
    createdById: 1,
    tenantId: 'tenant1'
  },
  {
    id: 4,
    title: 'Pest Control Treatment',
    description: 'Schedule pest control service for ants and spiders.',
    status: 'IN_PROGRESS',
    dueDate: '2024-06-18',
    scheduledDate: '2024-06-17',
    completionDate: null,
    priority: 'LOW',
    isRecurring: true,
    assignedToId: 3,
    createdById: 1,
    tenantId: 'tenant1'
  }
];

async function seedUsers() {
  console.log('Starting to seed users...');
  
  for (const user of exampleUsers) {
    const item = {
      id: { N: user.id.toString() },
      name: { S: user.name },
      email: { S: user.email },
      role: { S: user.role },
      tenantId: { S: user.tenantId }
    };

    const command = new PutItemCommand({
      TableName: TABLES.USERS,
      Item: item,
    });

    try {
      await docClient.send(command);
      console.log(`Successfully seeded user: ${user.name}`);
    } catch (error) {
      console.error(`Error seeding user ${user.name}:`, error);
    }
  }

  console.log('Finished seeding users.');
}

async function seedTasks() {
  console.log('Starting to seed tasks...');
  
  for (const task of exampleTasks) {
    const now = new Date().toISOString();
    const item: any = {
      id: { N: task.id.toString() },
      title: { S: task.title },
      status: { S: task.status },
      tenantId: { S: task.tenantId },
      createdById: { N: task.createdById.toString() },
      createdAt: { S: now },
      updatedAt: { S: now }
    };

    if (task.description !== null && task.description !== undefined) item.description = { S: task.description };
    if (task.dueDate !== null && task.dueDate !== undefined) item.dueDate = { S: task.dueDate };
    if (task.assignedToId !== null && task.assignedToId !== undefined) item.assignedToId = { N: task.assignedToId.toString() };
    if (task.scheduledDate !== null && task.scheduledDate !== undefined) item.scheduledDate = { S: task.scheduledDate };
    if (task.completionDate !== null && task.completionDate !== undefined) item.completionDate = { S: task.completionDate };
    if (task.priority !== null && task.priority !== undefined) item.priority = { S: task.priority };
    if (task.isRecurring !== undefined && task.isRecurring !== null) item.isRecurring = { BOOL: task.isRecurring };

    const command = new PutItemCommand({
      TableName: TABLES.TASKS,
      Item: item,
    });

    try {
      await docClient.send(command);
      console.log(`Successfully seeded task: ${task.title}`);
    } catch (error) {
      console.error(`Error seeding task ${task.title}:`, error);
    }
  }

  console.log('Finished seeding tasks.');
}

// Run the seeding functions
async function seed() {
  try {
    await seedUsers();
    await seedTasks();
  } catch (error) {
    console.error('Error during seeding:', error);
  }
}

seed().catch(console.error); 