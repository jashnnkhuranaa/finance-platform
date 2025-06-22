// lib/db/overview.js
import { createConnection } from '@/lib/db/db';
import { getCache, setCache } from '@/lib/cache';

async function getOverviewByUserId(userId) {
  const cacheKey = `overview:user:${userId}`;
  const cachedOverview = getCache(cacheKey);
  if (cachedOverview) {
    console.log('✅ Cache hit for overview:', userId);
    return cachedOverview;
  }

  const conn = await createConnection();
  try {
    const [rows] = await conn.execute(
      'SELECT SUM(amount) as total, COUNT(*) as count FROM transactions WHERE userId = ?',
      [userId]
    );
    const overview = rows[0];
    setCache(cacheKey, overview, 300000); // 5 min TTL for overview
    return overview;
  } catch (error) {
    console.error('❌ Error fetching overview:', error.message);
    throw error;
  } finally {
    conn.release();
  }
}

export { getOverviewByUserId };