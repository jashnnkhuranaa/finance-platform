import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@/lib/auth/jwt';
import { createConnection } from '@/lib/db/db';

export async function GET(request: NextRequest) {
  try {
    // Get the access token from cookies
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
      console.log('No access token found in cookies');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify the token and extract userId
    const decodedToken = verifyAccessToken(accessToken);
    const userId = (decodedToken as any).sub || (decodedToken as any).userId; // Adjust based on your token payload
    console.log('Decoded User ID:', userId);

    if (!userId) {
      console.log('User ID not found in token');
      return NextResponse.json({ error: 'Invalid token payload' }, { status: 401 });
    }

    // Get query params for date range
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    console.log('Date Range:', { startDate, endDate });

    let connection;
    try {
      connection = await createConnection();

      // Fetch accounts
      const [accountsResult] = await connection.query(
        'SELECT * FROM accounts WHERE userId = ?',
        [userId]
      );
      const accounts = Array.isArray(accountsResult) ? accountsResult : [];
      console.log('Fetched Accounts:', accounts);

      // Fetch transactions within the date range
      let transactionsQuery = 'SELECT * FROM transactions WHERE userId = ?';
      const queryParams: any[] = [userId];

      if (startDate && endDate) {
        transactionsQuery += ' AND DATE(date) BETWEEN ? AND ?';
        queryParams.push(startDate, endDate);
      }

      const [transactionsResult] = await connection.query(
        transactionsQuery,
        queryParams
      );
      const transactions = Array.isArray(transactionsResult) ? transactionsResult : [];
      console.log('Fetched Transactions:', transactions);

      // Fetch categories
      const [categoriesResult] = await connection.query(
        'SELECT * FROM categories WHERE userId = ?',
        [userId]
      );
      const categories = Array.isArray(categoriesResult) ? categoriesResult : [];
      console.log('Fetched Categories:', categories);

      // If no transactions, log and proceed
      if (!transactions || transactions.length === 0) {
        console.log('No transactions found for user');
      }

      // Calculate remaining, income, and expenses
      const income = transactions
        .filter((t: any) => t.amount >= 0)
        .reduce((sum: number, t: any) => sum + Number(t.amount), 0);

      const expenses = transactions
        .filter((t: any) => t.amount < 0)
        .reduce((sum: number, t: any) => sum + Math.abs(Number(t.amount)), 0);

      const remaining = income - expenses;

      console.log('Calculated Values:', { remaining, income, expenses });

      return NextResponse.json({
        remaining,
        income,
        expenses,
        transactions,
        categories,
        accounts,
      });
    } finally {
      if (connection) {
        await connection.end();
        console.log('Database connection closed');
      }
    }
  } catch (error) {
    console.error('Error fetching overview data:', error);
    return NextResponse.json({ error: 'Unauthorized or invalid token' }, { status: 401 });
  }
}