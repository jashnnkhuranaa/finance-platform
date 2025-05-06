//verify-token/route.js

import { NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/auth/jwt";

export async function POST(req) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    const decoded = verifyAccessToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    return NextResponse.json({ decoded }, { status: 200 });
  } catch (error) {
    console.error("❌ Verify token error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
