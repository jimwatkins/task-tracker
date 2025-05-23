import fetch from 'node-fetch';

async function testGraphQL() {
  console.log('Testing GraphQL server...');

  const query = `
    query {
      tasks(tenantId: "tenant1") {
        id
        title
        description
        status
        dueDate
      }
    }
  `;

  try {
    const response = await fetch('http://localhost:4001/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    const result = await response.json();
    console.log('Response:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error testing GraphQL:', error);
  }
}

testGraphQL(); 