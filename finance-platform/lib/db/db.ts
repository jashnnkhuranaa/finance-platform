//lib/db/db.ts

import { config } from 'dotenv';

// Explicitly load .env.local file
config({ path: '.env.local' });

import mysql from 'mysql2/promise';

export async function createConnection() {
  console.log('DATABASE_URL:', process.env.DATABASE_URL);
  return mysql.createConnection(process.env.DATABASE_URL!);
}
