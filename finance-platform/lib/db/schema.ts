//lib/db/schema.ts

import { createConnection } from './db';

async function createTables() {
  const connection = await createConnection();
  try {
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS accounts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        userId VARCHAR(255) NOT NULL,
        plaidId VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ accounts table created successfully');
  } catch (error) {
    console.error('❌ Error creating table:', error);
  } finally {
    await connection.end();
  }
}

createTables();
