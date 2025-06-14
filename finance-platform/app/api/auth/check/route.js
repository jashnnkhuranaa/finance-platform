import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/auth/jwt";

export async function GET() {
  try {
    console.log("Starting /api/auth/check request");
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    console.log("Auth Check: Access Token:", accessToken ? "Present" : "Not Present");

    if (!accessToken) {
      console.log("Auth Check: No access token found");
      return NextResponse.json({ isAuthenticated: false }, { status: 401 });
    }

    const payload = verifyAccessToken(accessToken);
    if (!payload || typeof payload === "string" || !("id" in payload)) {
      console.log("Auth Check: Token verification failed, payload:", payload);
      const response = NextResponse.json(
        { isAuthenticated: false },
        { status: 401 }
      );
      response.cookies.delete("accessToken");
      return response;
    }

    console.log("Auth Check: Token Payload:", payload);
    return NextResponse.json({ isAuthenticated: true, userId: payload.id }, { status: 200 });
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

// Handle other methods (to avoid 405)
export async function POST() {
  return NextResponse.json(
    { error: "Method Not Allowed" },
    { status: 405 }
  );
}