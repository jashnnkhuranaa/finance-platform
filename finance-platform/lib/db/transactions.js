import { createConnection } from '@/lib/db/db';
import mysql from 'mysql2/promise';

async function getTransactionsByUserId(userId, limit = 10, offset = 0) {
  const conn = await createConnection();
  try {
    const query = `SELECT id, date, accountId, categoryId, payee, amount, notes, created_at FROM transactions WHERE userId = ${mysql.escape(userId)} LIMIT ${Number(limit)} OFFSET ${Number(offset)}`;
    const [rows] = await conn.query(query);
    return rows;
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  } finally {
    conn.release();
  }
}

export { getTransactionsByUserId };