
// app/api/transactions/actions/delete-transactions.ts
'use server';

import { createConnection } from '@/lib/db/db';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@/lib/auth/jwt';
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

export async function deleteTransactions(transactionIds: string[]) {
  if (!transactionIds || transactionIds.length === 0) {
    return { error: 'No transactions selected' };
  }

  const userId = await getUserIdFromToken();
  if (!userId) {
    return { error: 'Unauthorized' };
  }

  try {
    const conn = await createConnection();
    const placeholders = transactionIds.map(() => '?').join(',');
    const [result] = await conn.execute(
      `DELETE FROM transactions WHERE id IN (${placeholders}) AND userId = ?`,
      [...transactionIds, userId]
    );
    await conn.end();

    const affectedRows = (result as any).affectedRows;
    console.log(`✅ Deleted ${affectedRows} transactions for userId: ${userId}`);
    return { success: true, deletedCount: affectedRows };
  } catch (err) {
    console.error('❌ Error deleting transactions:', err);
    return { error: 'Failed to delete transactions' };
  }
}