'use strict';

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@/lib/auth/jwt';
import { getCategoriesByUserId } from '@/lib/db/categories';

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
    const categories = await getCategoriesByUserId(userId);
    console.log(`✅ Fetched categories for userId: ${userId}`, categories);
    return NextResponse.json({ categories });
  } catch (error) {
    console.error('❌ Error fetching categories:', error.message);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}