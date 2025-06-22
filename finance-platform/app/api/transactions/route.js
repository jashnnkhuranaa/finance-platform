'use strict';

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@/lib/auth/jwt';
import { getTransactionsByUserId } from '@/lib/db/transactions';

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
    const transactions = await getTransactionsByUserId(userId, 10, 0);
    console.log(`✅ Fetched transactions for userId: ${userId}`, transactions);
    return NextResponse.json({ transactions });
  } catch (error) {
    console.error('❌ Error fetching transactions:', error.message);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}