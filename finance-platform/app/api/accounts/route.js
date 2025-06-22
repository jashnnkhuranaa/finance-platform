'use strict';

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@/lib/auth/jwt';
import { getAccountsByUserId } from '@/lib/db/accounts';

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
    const accounts = await getAccountsByUserId(userId);
    return NextResponse.json({ accounts });
  } catch (error) {
    console.error('❌ Error fetching accounts:', error.message);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}