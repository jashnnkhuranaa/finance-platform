import { cookies } from 'next/headers';
import { verifyAccessToken } from '@/lib/auth/jwt';
import { users } from '@/lib/db/users';
import { NextResponse } from 'next/server';

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  if (!accessToken) {
    return NextResponse.json({ error: 'Access token missing' }, { status: 401 });
  }

  try {
    // Get the decoded token from the verifyAccessToken function
    const payload = verifyAccessToken(accessToken);

    // Type guard to check if the decoded payload is a valid JwtPayload
    if (typeof payload !== 'string' && 'id' in payload && 'role' in payload) {
      // Now it's safe to access payload.id and payload.role
      const user = users.find((u) => u.id === payload.id);
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      return NextResponse.json({
        id: user.id,
        email: user.email,
        role: user.role,
      });
    } else {
      return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
    }
  } catch (err) {
    return NextResponse.json({ error: 'Invalid or expired access token' }, { status: 403 });
  }
}
