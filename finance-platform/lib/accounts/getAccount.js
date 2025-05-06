// lib/accounts/getAccounts.js
const { createConnection } = require("@/lib/db/db");
const { getUserIdFromToken } = require("@/lib/auth/getUserIdfromToken");

async function getAccounts() {
  const userId = await getUserIdFromToken();
  if (!userId) return [];
  const db = await createConnection();
  const [rows] = await db.execute(
    "SELECT id, name, plaidId, created_at FROM accounts WHERE userId = ? ORDER BY created_at DESC",
    [userId]
  );
  await db.end();
  return rows;
}

export { getAccounts };
