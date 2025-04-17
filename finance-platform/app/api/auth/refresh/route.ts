import { cookies } from 'next/headers';
import { users } from '@/lib/db/users';
import { 
  signAccessToken, 
  signRefreshToken, 
  verifyRefreshToken, 
  setAuthCookies 
} from '@/lib/auth/jwt';
import { NextResponse } from 'next/server';

export async function POST() {
  // ✅ Get cookie safely
  const cookieStore = await cookies();
  const refreshCookie = cookieStore.get('refresh_token');
  const refreshToken = refreshCookie?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: 'Refresh token not found' }, { status: 401 });
  }

  try {
    // ✅ Add proper payload type
    const payload = verifyRefreshToken(refreshToken) as { id: string };

    // ✅ Lookup user
    const user = users.find((u) => u.id === payload.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // ✅ Create new tokens
    const newAccessToken = signAccessToken({ id: user.id, role: user.role });
    const newRefreshToken = signRefreshToken({ id: user.id });

    // ✅ Create response
    const res = NextResponse.json({ message: 'Token refreshed' });

    // ✅ Set cookies via your util
    setAuthCookies(res, newAccessToken, newRefreshToken);

    return res;
  } catch (err) {
    return NextResponse.json({ error: 'Invalid refresh token' }, { status: 403 });
  }
}
