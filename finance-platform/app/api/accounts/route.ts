import { createConnection } from '@/lib/db/db';
import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/auth/jwt';
import { randomUUID } from 'crypto'; // createId ki jagah

export async function POST(req: NextRequest) {
  const token = req.cookies.get('accessToken')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decoded = verifyAccessToken(token);

    if (typeof decoded !== 'string' && 'userId' in decoded) {
      const userId = decoded.userId;
      const body = await req.json();
      const { name } = body;

      if (!name || typeof name !== 'string' || name.trim() === '') {
        return NextResponse.json({ error: 'Invalid name input' }, { status: 400 });
      }

      const connection = await createConnection();

      try {
        const [result] = await connection.execute(
          'INSERT INTO accounts (id, user_id, name) VALUES (?, ?, ?)',
          [randomUUID(), userId, name.trim()]
        );

        return NextResponse.json({ message: 'Account created successfully', result });
      } catch (dbError) {
        console.error('DB Error:', dbError);
        return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
      } finally {
        await connection.end();
      }

    } else {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  } catch (err) {
    console.error('Token error:', err);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
