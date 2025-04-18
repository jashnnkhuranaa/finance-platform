import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { users, User } from '@/lib/db/users';
import { signAccessToken, signRefreshToken, setAuthCookies } from '@/lib/auth/jwt';

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password, role } = body;

  if (!email || !password || !role) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  const existingUser = users.find((u) => u.email === email);
  if (existingUser) {
    return NextResponse.json({ error: 'User already exists' }, { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser: User = {
    id: crypto.randomUUID(),
    email,
    password: hashedPassword,
    role,
  };

  users.push(newUser);

  const accessToken = signAccessToken({ id: newUser.id, role: newUser.role });
  const refreshToken = signRefreshToken({ id: newUser.id });

  const response = NextResponse.json({
    message: 'User registered successfully',
    user: { id: newUser.id, email, role: newUser.role },
  });

  setAuthCookies(response, accessToken, refreshToken);

  return response;
}
