import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.pathname;
  const accessToken = request.cookies.get('accessToken')?.value;

  console.log('Middleware: URL:', url);
  console.log('Middleware: Access Token:', accessToken);

  // Protect /overview route: Redirect to /login if not authenticated
  if (url.startsWith('/overview')) {
    if (!accessToken) {
      console.log('Middleware: No access token, redirecting to /login');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Verify the token by calling /api/auth/check
    const authResponse = await fetch(`${request.nextUrl.origin}/api/auth/check`, {
      headers: {
        Cookie: `accessToken=${accessToken}`,
      },
    });
    const authData = await authResponse.json();
    console.log('Middleware: Auth Check Response:', authData);

    if (!authData.isAuthenticated) {
      console.log('Middleware: Token invalid or expired, redirecting to /login');
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/overview/:path*'],
};