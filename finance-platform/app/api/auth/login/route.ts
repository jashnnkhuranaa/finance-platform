import { NextResponse } from 'next/server';
import { getUserByEmail } from '@/lib/db/users';
import bcrypt from 'bcryptjs';
import { signAccessToken, signRefreshToken, setAuthCookies } from '@/lib/auth/jwt';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    const accessToken = signAccessToken({ id: user.id, role: user.role });
    const refreshToken = signRefreshToken({ id: user.id });

    const res = NextResponse.json({
      message: 'Login successful',
      user: { id: user.id, email: user.email, role: user.role },
    });

    return setAuthCookies(res, accessToken, refreshToken);
  } catch (error) {
    console.error('❌ Login error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}