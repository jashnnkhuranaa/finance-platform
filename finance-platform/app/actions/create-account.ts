// app/api/accounts/actions/create-account.ts
'use server';

import { z } from 'zod';
import { createConnection } from '@/lib/db/db';

// Validation schema
const schema = z.object({
  name: z.string().min(1),
  userId: z.string(),  // assuming user is identified
  plaidId: z.string(), // static or from some Plaid setup
});

export async function createAccount(formData: FormData) {
  const raw = {
    name: formData.get('name'),
    userId: 'demo-user-123', // TODO: replace with real session userId
    plaidId: 'demo-plaid-123', // TODO: replace with real Plaid ID if available
  };

  const parsed = schema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const { name, userId, plaidId } = parsed.data;

  try {
    const conn = await createConnection();
    await conn.execute(
      `INSERT INTO accounts (name, userId, plaidId) VALUES (?, ?, ?)`,
      [name, userId, plaidId]
    );
    await conn.end();
    return { success: true };
  } catch (err) {
    console.error('DB Error:', err);
    return { error: { db: 'Database error' } };
  }
}
