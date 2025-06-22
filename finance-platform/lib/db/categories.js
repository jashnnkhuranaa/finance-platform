// lib/db/categories.js
import { createConnection } from '@/lib/db/db';
import { getCache, setCache } from '@/lib/cache';

async function getCategoriesByUserId(userId) {
  const cacheKey = `categories:user:${userId}`;
  const cachedCategories = getCache(cacheKey);
  if (cachedCategories) {
    console.log('✅ Cache hit for categories:', userId);
    return cachedCategories;
  }

  const conn = await createConnection();
  try {
    const [rows] = await conn.execute(
      'SELECT id, name, plaidId FROM categories WHERE userId = ?',
      [userId]
    );
    setCache(cacheKey, rows);
    return rows;
  } catch (error) {
    console.error('❌ Error fetching categories:', error.message);
    throw error;
  } finally {
    conn.release();
  }
}

export { getCategoriesByUserId };