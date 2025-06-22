'use strict';

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@/lib/auth/jwt';
import { getOverviewByUserId } from '@/lib/db/overview';

export async function GET(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'No access token provided' },
        { status: 401 }
      );
    }

    const decoded = verifyAccessToken(token);
    if (typeof decoded === 'string' || !('id' in decoded)) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const userId = decoded.id;
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing date range' },
        { status: 400 }
      );
    }

    const overviewData = await getOverviewByUserId(userId, startDate, endDate);
    return NextResponse.json(overviewData, { status: 200 });
  } catch (error) {
    console.error('Error fetching overview data:', error.message);
    return NextResponse.json(
      { error: 'Failed to fetch overview data' },
      { status: 500 }
    );
  }
}