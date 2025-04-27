import { NextRequest, NextResponse } from 'next/server';
import { createConnection } from '@/lib/db/db';
import { verifyAccessToken } from '@/lib/auth/jwt';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('accessToken')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized: Token not found' }, { status: 401 });
  }

  try {
    const decoded = verifyAccessToken(token);

    if (typeof decoded !== 'string' && 'userId' in decoded) {
      const userId = decoded.userId; // ✅ UserId uthaya decoded token se

      const connection = await createConnection();

      try {
        const [rows] = await connection.execute(
          'SELECT id, name FROM accounts WHERE user_id = ?', [userId]
          // ✅ Only apne user ke accounts laane ka query
        );

        return NextResponse.json({ data: rows });
      } catch (error) {
        console.error('Error fetching accounts:', error);
        return NextResponse.json({ error: 'Failed to fetch accounts' }, { status: 500 });
      } finally {
        await connection.end();
      }
    } else {
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }
  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
  }
}
