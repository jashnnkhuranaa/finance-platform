import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { createConnection } from "@/lib/db/db";

async function getUserIdFromToken() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    if (!token) return null;
    const decoded = verifyAccessToken(token);
    if (typeof decoded === "string" || !("id" in decoded)) return null;
    return decoded.id;
  } catch (err) {
    console.error("❌ Invalid or missing JWT:", err);
    return null;
  }
}

async function getOverviewData() {
  const userId = await getUserIdFromToken();
  if (!userId) {
    return { error: "Unauthorized" };
  }

  try {
    const conn = await createConnection();
    // Fetch remaining balance, income, expenses
    const [summary] = await conn.execute(
      `SELECT 
        (SELECT SUM(balance) FROM accounts WHERE userId = ?) as remaining,
        (SELECT SUM(amount) FROM transactions WHERE userId = ? AND amount > 0 AND created_at BETWEEN '2024-04-10' AND '2024-05-10') as income,
        (SELECT SUM(amount) FROM transactions WHERE userId = ? AND amount < 0 AND created_at BETWEEN '2024-04-10' AND '2024-05-10') as expenses`,
      [userId, userId, userId]
    );

    // Fetch transactions for chart
    const [transactions] = await conn.execute(
      `SELECT DATE(created_at) as date, 
              SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END) as income,
              SUM(CASE WHEN amount < 0 THEN amount ELSE 0 END) as expenses
       FROM transactions 
       WHERE userId = ? AND created_at BETWEEN '2024-04-10' AND '2024-05-10'
       GROUP BY DATE(created_at)`,
      [userId]
    );

    // Fetch categories for pie chart
    const [categories] = await conn.execute(
      `SELECT category as name, ABS(SUM(amount)) as value 
       FROM transactions 
       WHERE userId = ? AND amount < 0 AND created_at BETWEEN '2024-04-10' AND '2024-05-10'
       GROUP BY category`,
      [userId]
    );

    await conn.end();

    return {
      remaining: summary[0].remaining || 0,
      income: summary[0].income || 0,
      expenses: summary[0].expenses || 0,
      transactions: transactions.map((t) => ({
        date: t.date.toISOString().split("T")[0],
        income: t.income,
        expenses: t.expenses,
      })),
      categories: categories.map((c) => ({
        name: c.name,
        value: (c.value / Math.abs(summary[0].expenses)) * 100, // Convert to percentage
      })),
    };
  } catch (err) {
    console.error("❌ Error fetching overview data:", err);
    return { error: "Something went wrong" };
  }
}

module.exports = { getOverviewData };
