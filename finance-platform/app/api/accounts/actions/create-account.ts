'use server';

import { z } from 'zod';
import { createConnection } from '@/lib/db/db';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@/lib/auth/jwt';
import { RowDataPacket } from 'mysql2';

const formSchema = z.object({
  name: z.string().min(1),
});

type Input = z.infer<typeof formSchema>;

async function getUserIdFromToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;
    if (!token) return null;

    const decoded = verifyAccessToken(token);
    return decoded.id;
  } catch (err) {
    console.error('❌ Invalid or missing JWT:', err);
    return null;
  }
}

export async function getPlaidIdForUser(userId: string): Promise<string | null> {
  const conn = await createConnection();
  try {
    const [result] = await conn.execute(
      'SELECT plaidId FROM users WHERE id = ? LIMIT 1',
      [userId]
    );

    const rows = result as RowDataPacket[];
    return rows[0]?.plaidId || null;
  } catch (error) {
    console.error('❌ Error fetching plaidId:', error);
    return null;
  } finally {
    await conn.end();
  }
}

export async function createAccount(input: Input) {
  const parsed = formSchema.safeParse(input);
  if (!parsed.success) {
    return { error: 'Invalid input' };
  }

  const userId = await getUserIdFromToken();
  if (!userId) {
    return { error: 'Unauthorized' };
  }

  const plaidId = await getPlaidIdForUser(userId);
  if (!plaidId) {
    return { error: 'No linked Plaid account found for this user.' };
  }

  const { name } = parsed.data;

  try {
    const conn = await createConnection();
    await conn.execute(
      `INSERT INTO accounts (name, userId, plaidId) VALUES (?, ?, ?)`,
      [name, userId, plaidId]
    );
    await conn.end();
    return { success: true };
  } catch (err) {
    console.error('❌ Error creating account:', err);
    return { error: 'Something went wrong' };
  }
}
