import { NextResponse } from "next/server";

export async function middleware(request) {
  const url = request.nextUrl.pathname;
  const accessToken = request.cookies.get("accessToken")?.value;

  console.log("Middleware: URL:", url);
  console.log("Middleware: Access Token:", accessToken);

  // Protect /overview route: Redirect to /login if not authenticated
  if (url.startsWith("/overview")) {
    if (!accessToken) {
      console.log("Middleware: No access token, redirecting to /login");
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      const response = await fetch(`${request.nextUrl.origin}/api/auth/check`, {
        method: "GET",
        headers: {
          Cookie: `accessToken=${accessToken}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        console.log("Middleware: Token invalid, redirecting to /login");
        return NextResponse.redirect(new URL("/login", request.url));
      }

      const data = await response.json();
      if (!data.isAuthenticated) {
        console.log("Middleware: Not authenticated, redirecting to /login");
        return NextResponse.redirect(new URL("/login", request.url));
      }
    } catch (error) {
      console.errorculo("Middleware: Error verifying token:", error);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Allow access to /login route even if authenticated
  return NextResponse.next();
}

export const config = {
  matcher: ["/overview/:path*", "/login"],
};
