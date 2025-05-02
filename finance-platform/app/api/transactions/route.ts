// app/api/transactions/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@/lib/auth/jwt';
import { createConnection } from '@/lib/db/db';
import { RowDataPacket } from 'mysql2/promise';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyAccessToken(token);
    if (typeof decoded === 'string' || !('id' in decoded)) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const userId = decoded.id;
    const conn = await createConnection();
    const [rows] = await conn.execute<RowDataPacket[]>(
      'SELECT id, date, accountId, categoryId, payee, amount, notes, created_at FROM transactions WHERE userId = ?',
      [userId]
    );
    await conn.end();

    console.log(`✅ Fetched transactions for userId: ${userId}`, rows);
    return NextResponse.json({ transactions: rows });
  } catch (err) {
    console.error('❌ Error fetching transactions:', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}