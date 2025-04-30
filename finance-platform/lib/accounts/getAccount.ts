// lib/accounts/getAccounts.ts

import { createConnection } from '@/lib/db/db';
import { getUserIdFromToken } from '@/lib/auth/getUserIdfromToken';

export async function getAccounts() {
  const userId = await getUserIdFromToken();

  if (!userId) return [];

  const db = await createConnection();

  const [rows] = await db.execute(
    'SELECT id, name, plaidId, created_at FROM accounts WHERE userId = ? ORDER BY created_at DESC',
    [userId]
  );

  await db.end();

  return rows as {
    id: number;
    name: string;
    plaidId: string;
    created_at: Date;
  }[];
}
