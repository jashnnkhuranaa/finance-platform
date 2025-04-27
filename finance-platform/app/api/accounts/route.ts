import { NextRequest, NextResponse } from 'next/server';
import { createConnection } from '@/lib/db/db';

export async function GET(req: NextRequest) {
  const connection = await createConnection();

  try {
    const [rows] = await connection.execute(
      'SELECT id, name FROM accounts'
    );

    return NextResponse.json({ data: rows });
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return NextResponse.json({ error: 'Failed to fetch accounts' }, { status: 500 });
  } finally {
    await connection.end();
  }
}
