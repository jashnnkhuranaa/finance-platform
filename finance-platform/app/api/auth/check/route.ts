import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@/lib/auth/jwt';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
      return NextResponse.json({ isAuthenticated: false }, { status: 401 });
    }

    // Verify the access token
    verifyAccessToken(accessToken);
    return NextResponse.json({ isAuthenticated: true }, { status: 200 });
  } catch (error) {
    console.error('❌ Auth check error:', error);
    return NextResponse.json({ isAuthenticated: false }, { status: 401 });
  }
}