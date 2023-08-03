const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgresql://func:test_password@localhost:5432/func_pg'
});

async function createTestData() {
  await client.connect();

  const conversation_id = 'fef6c0e1-78fa-4858-8cd9-f2697c82adc0'; // Replace with your conversation ID
  const user_id = '2b802813-86f0-4130-a06b-7e1775350592'; // Replace with your user ID
  const tenant_id = 'ec224ff1-0f67-4164-8d06-37692f134c3a'; // Replace with your tenant ID

  for (let i = 1; i <= 100; i++) {
    const role = i % 2 === 0 ? 'assistant' : 'user';
    const content = `Message ${i}`;
    const query = `
      INSERT INTO messages (id, role, content, conversation_id, user_id, tenant_id)
      VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5)
    `;
    await client.query(query, [role, content, conversation_id, user_id, tenant_id]);
  }

  await client.end();
}

createTestData().catch(console.error);