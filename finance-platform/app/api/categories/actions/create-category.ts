
// app/api/categories/actions/create-category.ts
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
    if (!token) return null;

    const decoded = verifyAccessToken(token);
    if (typeof decoded === 'string' || !('id' in decoded)) return null;
    return decoded.id;
  } catch (err) {
    console.error('❌ Invalid or missing JWT:', err);
    return null;
  }
}

export async function createCategory(formData: FormData) {
  const name = formData.get('name')?.toString();
  if (!name) {
    return { error: 'Name is required' };
  }

  const userId = await getUserIdFromToken();
  if (!userId) {
    return { error: 'Unauthorized' };
  }

  try {
    const conn = await createConnection();
    const id = uuidv4();
    const [existing] = await conn.execute<RowDataPacket[]>(
      'SELECT 1 FROM categories WHERE userId = ? AND name = ? LIMIT 1',
      [userId, name]
    );

    if (existing.length > 0) {
      await conn.end();
      return { error: 'Category already exists' };
    }

    await conn.execute(
      'INSERT INTO categories (id, userId, name, plaidId, created_at) VALUES (?, ?, ?, ?, ?)',
      [id, userId, name, null, new Date()]
    );

    await conn.end();
    console.log(`✅ Created category: ${name} for userId: ${userId}`);
    return { success: true };
  } catch (err) {
    console.error('❌ Error creating category:', err);
    return { error: 'Something went wrong' };
  }
}