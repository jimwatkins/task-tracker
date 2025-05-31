import { ScanCommand, DeleteItemCommand } from '@aws-sdk/client-dynamodb';
import { docClient, TABLES } from './dynamodb';

async function clearUsers() {
  console.log('Starting to clear users...');
  
  try {
    // First, get all users
    const scanCommand = new ScanCommand({
      TableName: TABLES.USERS
    });
    
    const { Items } = await docClient.send(scanCommand);
    
    if (!Items || Items.length === 0) {
      console.log('No users found to delete.');
      return;
    }

    // Delete each user
    for (const item of Items) {
      const deleteCommand = new DeleteItemCommand({
        TableName: TABLES.USERS,
        Key: {
          id: item.id
        }
      });

      await docClient.send(deleteCommand);
      console.log(`Deleted user with ID: ${item.id.S}`);
    }

    console.log('Successfully cleared all users.');
  } catch (error) {
    console.error('Error clearing users:', error);
  }
}

async function clearTasks() {
  console.log('Starting to clear tasks...');
  
  try {
    // First, get all tasks
    const scanCommand = new ScanCommand({
      TableName: TABLES.TASKS
    });
    
    const { Items } = await docClient.send(scanCommand);
    
    if (!Items || Items.length === 0) {
      console.log('No tasks found to delete.');
      return;
    }

    // Delete each task
    for (const item of Items) {
      const deleteCommand = new DeleteItemCommand({
        TableName: TABLES.TASKS,
        Key: {
          id: item.id
        }
      });

      await docClient.send(deleteCommand);
      console.log(`Deleted task with ID: ${item.id.S}`);
    }

    console.log('Successfully cleared all tasks.');
  } catch (error) {
    console.error('Error clearing tasks:', error);
  }
}

// Run the clearing functions
async function clear() {
  try {
    await clearUsers();
    await clearTasks();
  } catch (error) {
    console.error('Error during clearing:', error);
  }
}

clear().catch(console.error); 