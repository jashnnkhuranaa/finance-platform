// lib/db/accounts.js
import { createConnection } from '@/lib/db/db';
import { getCache, setCache } from '@/lib/cache';

async function getAccountsByUserId(userId) {
  const cacheKey = `accounts:user:${userId}`;
  const cachedAccounts = getCache(cacheKey);
  if (cachedAccounts) {
    console.log('✅ Cache hit for accounts:', userId);
    return cachedAccounts;
  }

  const conn = await createConnection();
  try {
    const [rows] = await conn.execute(
      'SELECT id, name, plaidId FROM accounts WHERE userId = ?',
      [userId]
    );
    setCache(cacheKey, rows);
    return rows;
  } catch (error) {
    console.error('❌ Error fetching accounts:', error.message);
    throw error;
  } finally {
    conn.release();
  }
}

export { getAccountsByUserId };