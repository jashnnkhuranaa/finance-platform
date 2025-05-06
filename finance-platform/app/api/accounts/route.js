"use strict";
// app/api/accounts/route.js

import { NextResponse } from "next/server";
import { createConnection } from "@/lib/db/db";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/auth/jwt";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyAccessToken(token);
    if (typeof decoded === "string" || !("id" in decoded)) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const userId = decoded.id;
    const conn = await createConnection();
    try {
      const [rows] = await conn.execute(
        "SELECT id, name, plaidId, created_at FROM accounts WHERE userId = ?",
        [userId]
      );
      const accounts = rows;
      return NextResponse.json({ accounts });
    } finally {
      await conn.end();
    }
  } catch (error) {
    console.error("❌ Error fetching accounts:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
