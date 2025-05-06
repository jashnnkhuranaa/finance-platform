// app/api/categories/actions/delete-categories.js
"use server";

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

async function deleteCategories(categoryIds) {
  if (!categoryIds || categoryIds.length === 0) {
    return { error: "No categories selected" };
  }
  const userId = await getUserIdFromToken();
  if (!userId) {
    return { error: "Unauthorized" };
  }
  try {
    const conn = await createConnection();
    const placeholders = categoryIds.map(() => "?").join(",");
    const [result] = await conn.execute(
      `DELETE FROM categories WHERE id IN (${placeholders}) AND userId = ?`,
      [...categoryIds, userId]
    );
    await conn.end();
    const affectedRows = result.affectedRows;
    console.log(`✅ Deleted ${affectedRows} categories for userId: ${userId}`);
    return { success: true, deletedCount: affectedRows };
  } catch (err) {
    console.error("❌ Error deleting categories:", err);
    return { error: "Failed to delete categories" };
  }
}

export { deleteCategories };
