import { clearAuthCookies } from "@/lib/auth/jwt";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const res = NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 }
    );
    return clearAuthCookies(res);
  } catch (error) {
    console.error("❌ Logout error:", error.message);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
