// app/api/auth/check/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/auth/jwt";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    console.log("Auth Check: Access Token:", accessToken);

    if (!accessToken) {
      console.log("Auth Check: No access token found");
      return NextResponse.json({ isAuthenticated: false }, { status: 401 });
    }

    // Verify the access token
    const payload = verifyAccessToken(accessToken);
    if (!payload || typeof payload === "string" || !("id" in payload)) {
      console.log("Auth Check: Token verification failed");
      const response = NextResponse.json(
        { isAuthenticated: false },
        { status: 401 }
      );
      response.cookies.delete("accessToken");
      return response;
    }

    console.log("Auth Check: Token Payload:", payload);
    return NextResponse.json({ isAuthenticated: true }, { status: 200 });
  } catch (error) {
    console.error("❌ Auth check error:", error.message);
    const response = NextResponse.json(
      { isAuthenticated: false },
      { status: 401 }
    );
    response.cookies.delete("accessToken");
    return response;
  }
}
