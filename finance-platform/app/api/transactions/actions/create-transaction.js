// app/api/transactions/actions/create-transaction.js
"use server";

import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { createConnection } from "@/lib/db/db";
import { v4 as uuidv4 } from "uuid";

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

async function createTransaction(formData) {
  const date = formData.get("date")?.toString();
  const accountId = formData.get("accountId")?.toString();
  const categoryId = formData.get("categoryId")?.toString();
  const payee = formData.get("payee")?.toString();
  const amount = formData.get("amount")?.toString();
  const notes = formData.get("notes")?.toString();

  if (!date || !accountId || !categoryId || !payee || !amount) {
    return { error: "All fields except notes are required" };
  }

  const userId = await getUserIdFromToken();
  if (!userId) {
    return { error: "Unauthorized" };
  }

  try {
    const conn = await createConnection();
    const id = uuidv4();

    const [accountCheck] = await conn.execute(
      "SELECT 1 FROM accounts WHERE id = ? AND userId = ? LIMIT 1",
      [accountId, userId]
    );
    if (accountCheck.length === 0) {
      await conn.end();
      return { error: "Invalid account" };
    }

    const [categoryCheck] = await conn.execute(
      "SELECT 1 FROM categories WHERE id = ? AND userId = ? LIMIT 1",
      [categoryId, userId]
    );
    if (categoryCheck.length === 0) {
      await conn.end();
      return { error: "Invalid category" };
    }

    await conn.execute(
      "INSERT INTO transactions (id, userId, date, accountId, categoryId, payee, amount, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        id,
        userId,
        new Date(date),
        accountId,
        categoryId,
        payee,
        Number(amount),
        notes || null,
        new Date(),
      ]
    );

    await conn.end();
    console.log(`✅ Created transaction: ${payee} for userId: ${userId}`);
    return { success: true };
  } catch (err) {
    console.error("❌ Error creating transaction:", err);
    return { error: "Something went wrong" };
  }
}

export { createTransaction };
