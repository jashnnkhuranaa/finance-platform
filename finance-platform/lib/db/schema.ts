//lib/db/schema.ts

import { createConnection } from './db';

async function createTables() {
  const connection = await createConnection();
  try {
    // Create users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
        plaidId VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ users table created successfully');

    // Create accounts table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS accounts (
        id VARCHAR(36) NOT NULL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        userId VARCHAR(255) NOT NULL,
        plaidId VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id)
      )
    `);
    console.log('✅ accounts table created successfully');

    // Create categories table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS categories (
        id VARCHAR(36) NOT NULL PRIMARY KEY,
        userId VARCHAR(36) NOT NULL,
        name VARCHAR(255) NOT NULL,
        plaidId VARCHAR(255),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id)
      )
    `);
    console.log('✅ categories table created successfully');

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS transactions (
        id VARCHAR(36) NOT NULL PRIMARY KEY,
        userId VARCHAR(255) NOT NULL,
        date DATE NOT NULL,
        accountId VARCHAR(36) NOT NULL,
        categoryId VARCHAR(36) NOT NULL,
        payee VARCHAR(255) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (accountId) REFERENCES accounts(id),
        FOREIGN KEY (categoryId) REFERENCES categories(id),
        FOREIGN KEY (userId) REFERENCES users(id)
      )
    `);
    console.log('✅ transactions table created successfully');

  } catch (error) {
    console.error('❌ Error creating tables:', error);
  } finally {
    await connection.end();
  }
}

export { createTables };