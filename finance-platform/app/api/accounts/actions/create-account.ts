// ✅ /app/api/accounts/actions/create-account.ts
'use server';

import { z } from 'zod';
import { createConnection } from '@/lib/db/db';

const formSchema = z.object({
  name: z.string().min(1),
});

type Input = z.infer<typeof formSchema>;

export async function createAccount(input: Input) {
  const parsed = formSchema.safeParse(input);
  if (!parsed.success) {
    return { error: 'Invalid input' };
  }

  const { name } = parsed.data;

  try {
    const conn = await createConnection();

    // TODO: Replace with real user session logic
    const userId = 'user_123';
    const plaidId = 'mock_plaid_id';

    await conn.execute(
      `INSERT INTO accounts (name, userId, plaidId) VALUES (?, ?, ?)`,
      [name, userId, plaidId]
    );

    await conn.end();

    return { success: true };
  } catch (err) {
    console.error(err);
    return { error: 'Something went wrong' };
  }
}
