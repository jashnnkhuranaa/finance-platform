'use server';

import { cookies } from 'next/headers';
import { verifyAccessToken } from '@/lib/auth/jwt';
import { createConnection } from '@/lib/db/db';
import { v4 as uuidv4 } from 'uuid';
import { RowDataPacket } from 'mysql2/promise';

async function getUserIdFromToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;
    if (!token) {
      console.log('No access token found in cookies');
      return null;
    }

    const decoded = verifyAccessToken(token);
    if (typeof decoded === 'string' || !('id' in decoded)) {
      console.log('Invalid token or missing id in decoded token');
      return null;
    }
    return decoded.id;
  } catch (err) {
    console.error('❌ Invalid or missing JWT:', err);
    return null;
  }
}

export async function createAccount(formData: FormData) {
  const name = formData.get('name')?.toString();
  if (!name) {
    console.log('Name is missing in formData');
    return { error: 'Name is required' };
  }

  const userId = await getUserIdFromToken();
  if (!userId) {
    console.log('Unauthorized: No valid userId found');
    return { error: 'Unauthorized' };
  }

  try {
    const conn = await createConnection();
    const [existing] = await conn.execute<RowDataPacket[]>(
      'SELECT 1 FROM accounts WHERE userId = ? AND name = ? LIMIT 1',
      [userId, name]
    );

    if (existing.length > 0) {
      await conn.end();
      console.log(`Account with name '${name}' already exists for userId: ${userId}`);
      return { error: 'Account already exists' };
    }

    const id = uuidv4();
    console.log(`Generated account ID: ${id} for userId: ${userId}`);
    await conn.execute(
      'INSERT INTO accounts (id, userId, name, plaidId, created_at) VALUES (?, ?, ?, ?, ?)',
      [id, userId, name, null, new Date()]
    );

    await conn.end();
    console.log(`✅ Created account: ${name} for userId: ${userId}`);
    return { success: true };
  } catch (err) {
    console.error('❌ Error creating account:', err);
    return { error: 'Something went wrong' };
  }
}