import { createConnection } from './db';
import { RowDataPacket } from 'mysql2';

export type Role = 'admin' | 'user';

export interface User {
  id: string;
  email: string;
  password: string;
  role: Role;
  plaidId?: string;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const conn = await createConnection();
  try {
    const [rows] = await conn.execute(
      'SELECT id, email, password, role, plaidId FROM users WHERE email = ?',
      [email]
    );
    const users = rows as RowDataPacket[];
    return users[0] ? (users[0] as User) : null;
  } catch (error) {
    console.error('❌ Error fetching user:', error);
    return null;
  } finally {
    await conn.end();
  }
}

export async function createUser(email: string, password: string, role: Role = 'user'): Promise<User | null> {
  const conn = await createConnection();
  try {
    const id = generateId(); // Simple ID generator (replace with UUID in production)
    await conn.execute(
      'INSERT INTO users (id, email, password, role) VALUES (?, ?, ?, ?)',
      [id, email, password, role]
    );
    return { id, email, password, role };
  } catch (error) {
    console.error('❌ Error creating user:', error);
    return null;
  } finally {
    await conn.end();
  }
}

function generateId(): string {
  return Math.random().toString(36).slice(2);
}

