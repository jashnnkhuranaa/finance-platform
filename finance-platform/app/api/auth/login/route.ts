// app/api/auth/login/route.ts

import { NextResponse } from 'next/server';
import { users } from '@/lib/db/users';
import bcrypt from 'bcryptjs';
import { signAccessToken, signRefreshToken, setAuthCookies } from '@/lib/auth/jwt';

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
  }

  const user = users.find((u) => u.email === email);
  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const accessToken = signAccessToken({ id: user.id, role: user.role });
  const refreshToken = signRefreshToken({ id: user.id });

  const res = NextResponse.json({
    message: 'Login successful',
    user: { id: user.id, email: user.email, role: user.role },
  });

  return setAuthCookies(res, accessToken, refreshToken);
}
