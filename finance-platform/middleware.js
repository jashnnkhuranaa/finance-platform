// middleware.js
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
        console.log(
          "Middleware: Token invalid or endpoint error, redirecting to /login",
          response.status
        );
        const redirectResponse = NextResponse.redirect(
          new URL("/login", request.url)
        );
        redirectResponse.cookies.delete("accessToken");
        return redirectResponse;
      }

      const data = await response.json();
      console.log("Middleware: Auth Check Response:", data);
      if (!data.isAuthenticated) {
        console.log("Middleware: Not authenticated, redirecting to /login");
        const redirectResponse = NextResponse.redirect(
          new URL("/login", request.url)
        );
        redirectResponse.cookies.delete("accessToken");
        return redirectResponse;
      }
    } catch (error) {
      console.error("Middleware: Error verifying token:", error);
      const redirectResponse = NextResponse.redirect(
        new URL("/login", request.url)
      );
      redirectResponse.cookies.delete("accessToken");
      return redirectResponse;
    }
  }

  // Redirect authenticated users from /login to /overview
  if (url === "/login" && accessToken) {
    try {
      const response = await fetch(`${request.nextUrl.origin}/api/auth/check`, {
        method: "GET",
        headers: {
          Cookie: `accessToken=${accessToken}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        console.log(
          "Middleware: Token invalid or endpoint error for /login",
          response.status
        );
        const response = NextResponse.next();
        response.cookies.delete("accessToken");
        return response;
      }

      const data = await response.json();
      console.log("Middleware: Auth Check Response for /login:", data);
      if (data.isAuthenticated) {
        console.log("Middleware: User authenticated, redirecting to /overview");
        return NextResponse.redirect(new URL("/overview", request.url));
      }
    } catch (error) {
      console.error("Middleware: Error checking token for /login:", error);
      const response = NextResponse.next();
      response.cookies.delete("accessToken");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/overview/:path*", "/login"],
};
