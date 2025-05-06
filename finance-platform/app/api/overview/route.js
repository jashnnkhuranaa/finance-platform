// app/api/overview/route.js
import { NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/auth/jwt";

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
  return {
    remaining: 500,
    income: 800,
    expenses: 300,
    transactions: [
      {
        id: "1",
        date: "2025-05-05",
        accountId: "1",
        categoryId: "1",
        payee: "Payee 1",
        amount: -200,
        notes: null,
        created_at: "2025-05-05",
      },
      {
        id: "2",
        date: "2025-05-06",
        accountId: "1",
        categoryId: "2",
        payee: "Payee 2",
        amount: -100,
        notes: null,
        created_at: "2025-05-06",
      },
      {
        id: "3",
        date: "2025-05-07",
        accountId: "1",
        categoryId: "3",
        payee: "Salary",
        amount: 500,
        notes: null,
        created_at: "2025-05-07",
      },
      {
        id: "4",
        date: "2025-05-08",
        accountId: "1",
        categoryId: "3",
        payee: "Freelance",
        amount: 300,
        notes: null,
        created_at: "2025-05-08",
      },
    ],
    categories: [
      { id: "1", name: "Loan", created_at: "2025-05-01" },
      { id: "2", name: "Bank Fees", created_at: "2025-05-01" },
      { id: "3", name: "Income", created_at: "2025-05-01" },
    ],
  };
}

export { GET };
