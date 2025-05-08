// lib/reports/monthlyReports.js
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { createConnection } from "../db/db.js";
import cron from "node-cron";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { sendEmail } from "../utils/send-email.js";

// Generate AI-driven financial insights
async function generateFinancialInsights(stats, month) {
  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    Analyze this financial data and provide 3 concise, actionable insights.
    Focus on spending patterns and practical advice.
    Keep it friendly and conversational.

    Financial Data for ${month}:
    - Total Income: $${stats.totalIncome}
    - Total Expenses: $${stats.totalExpenses}
    - Net Income: $${stats.totalIncome - stats.totalExpenses}
    - Expense Categories: ${Object.entries(stats.byCategory)
      .map(([category, amount]) => `${category}: $${amount}`)
      .join(", ")}

    Format the response as a JSON array of strings, like this:
    ["insight 1", "insight 2", "insight 3"]
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Error generating insights:", error);
    return [
      "Your highest expense category this month might need attention.",
      "Consider setting up a budget for better financial management.",
      "Track your recurring expenses to identify potential savings.",
    ];
  }
}

// Get monthly stats for a user
async function getMonthlyStats(connection, userId, month) {
  const startDate = new Date(month.getFullYear(), month.getMonth(), 1);
  const endDate = new Date(month.getFullYear(), month.getMonth() + 1, 0);

  const [transactions] = await connection.execute(
    `
    SELECT t.amount, c.name AS category
    FROM transactions t
    JOIN categories c ON t.categoryId = c.id
    WHERE t.userId = ? AND t.date >= ? AND t.date <= ?
    `,
    [userId, startDate, endDate]
  );

  if (transactions.length === 0) {
    console.log(`Koi transactions nahi mile user ${userId} ke liye ${month.toLocaleString("default", { month: "long" })} mein`);
  }

  return transactions.reduce(
    (stats, t) => {
      const amount = parseFloat(t.amount);
      if (amount < 0) {
        stats.totalExpenses += Math.abs(amount);
        stats.byCategory[t.category] = (stats.byCategory[t.category] || 0) + Math.abs(amount);
      } else {
        stats.totalIncome += amount;
      }
      return stats;
    },
    {
      totalExpenses: 0,
      totalIncome: 0,
      byCategory: {},
      transactionCount: transactions.length,
    }
  );
}

// Generate and send monthly reports
async function generateMonthlyReports() {
  const connection = await createConnection();
  try {
    // Fetch users
    const [users] = await connection.execute(`
      SELECT id, email
      FROM users
    `);

    if (users.length === 0) {
      console.log("Database mein koi users nahi hain.");
      return;
    }

    for (const user of users) {
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      const monthName = lastMonth.toLocaleString("default", { month: "long" });

      // Get stats
      const stats = await getMonthlyStats(connection, user.id, lastMonth);

      // Generate AI insights
      const insights = await generateFinancialInsights(stats, monthName);

      // Send email
      await sendEmail({
        to: user.email,
        subject: `Your Monthly Financial Report - ${monthName}`,
        html: `
          <h1>Hello,</h1>
          <h2>Your ${monthName} Financial Report</h2>
          <p><strong>Total Income:</strong> $${stats.totalIncome.toFixed(2)}</p>
          <p><strong>Total Expenses:</strong> $${stats.totalExpenses.toFixed(2)}</p>
          <p><strong>Net Income:</strong> $${(stats.totalIncome - stats.totalExpenses).toFixed(2)}</p>
          <h3>Expense Breakdown:</h3>
          <ul>
            ${Object.entries(stats.byCategory)
              .map(([category, amount]) => `<li>${category}: $${amount.toFixed(2)}</li>`)
              .join("")}
          </ul>
          <h3>Insights:</h3>
          <ul>
            ${insights.map((insight) => `<li>${insight}</li>`).join("")}
          </ul>
          <p>Best regards,<br>Your Finance Platform</p>
        `,
      });
      console.log(`✅ Report bhej diya ${user.email} ko`);
    }
    console.log(`✅ ${users.length} reports process hue`);
  } catch (error) {
    console.error("❌ Reports generate karne mein error:", error);
  } finally {
    await connection.end();
  }
}

// Schedule monthly reports (1st of each month at midnight)
cron.schedule("0 0 1 * *", () => {
  console.log("Monthly reports chalu ho rahe hain...");
  generateMonthlyReports();
});

// Run immediately for testing
generateMonthlyReports();

export { generateMonthlyReports };