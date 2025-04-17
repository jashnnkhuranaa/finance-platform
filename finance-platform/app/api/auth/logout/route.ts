// app/api/auth/logout/route.ts

import { clearAuthCookies } from '@/lib/auth/jwt';
import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ message: 'Logged out successfully' });
  return clearAuthCookies(res);
}
