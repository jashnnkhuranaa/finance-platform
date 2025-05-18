// app/api/overview/route.js
import { NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { createConnection } from "@/lib/db/db";

async function GET(request) {
  try {
    const accessToken = request.cookies.get("accessToken")?.value;
    console.log("Access Token:", accessToken);
    if (!accessToken) {
      return NextResponse.json(
        { error: "No access token provided" },
        { status: 401 }
      );
    }
    const decodedToken = verifyAccessToken(accessToken);
    console.log("Decoded Token:", decodedToken);
    if (!decodedToken) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }
    const userId = decodedToken.userId;
    console.log("Decoded User ID:", userId);
    if (!userId) {
      return NextResponse.json(
        { error: "Invalid token: userId not found" },
        { status: 401 }
      );
    }
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: "Missing date range" },
        { status: 400 }
      );
    }
    const overviewData = await fetchOverviewData(userId, startDate, endDate);
    return NextResponse.json(overviewData, { status: 200 });
  } catch (error) {
    console.error("Error fetching overview data:", error);
    return NextResponse.json(
      { error: "Failed to fetch overview data" },
      { status: 500 }
    );
  }
}

async function fetchOverviewData(userId, startDate, endDate) {
  try {
    const conn = await createConnection();

    // Fetch transactions within the date range for the user
    const [transactions] = await conn.execute(
      'SELECT id, date, accountId, categoryId, payee, amount, notes, created_at FROM transactions WHERE userId = ? AND date BETWEEN ? AND ?',
      [userId, startDate, endDate] // Using userId, startDate, endDate
    );

    // Fetch categories for the user
    const [categories] = await conn.execute(
      'SELECT id, name, created_at FROM categories WHERE userId = ?',
      [userId]
    );

    // Calculate income, expenses, and remaining
    let income = 0;
    let expenses = 0;
    for (const transaction of transactions) {
      if (transaction.amount > 0) {
        income += transaction.amount;
      } else {
        expenses += Math.abs(transaction.amount);
      }
    }
    const remaining = income - expenses;

    await conn.end();

    console.log(`✅ Fetched overview data for userId: ${userId}`, { remaining, income, expenses });

    return {
      remaining,
      income,
      expenses,
      transactions,
      categories,
    };
  } catch (error) {
    console.error('❌ Error fetching overview data from database:', error);
    throw error;
  }
}

export { GET };