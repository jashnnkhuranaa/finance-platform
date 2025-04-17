import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAccessToken } from './lib/auth/jwt';
import { JwtPayload } from 'jsonwebtoken';

const protectedRoutes = ['/dashboard', '/admin-only'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('access_token')?.value;

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const decoded = verifyAccessToken(token);

      if (typeof decoded !== 'string' && 'role' in decoded) {
        const response = NextResponse.next();
        response.headers.set('x-user-role', decoded.role);
        return response;
      }

      return NextResponse.redirect(new URL('/login', request.url));
    } catch (err) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

// ✅ This goes in middleware.ts — NOT in next.config.ts
export const config = {
  matcher: ['/dashboard/:path*', '/admin-only/:path*'],
};
