// lib/auth/getUserIdFromToken.ts

import { cookies } from 'next/headers';
import { verifyAccessToken } from './jwt';

export const getUserIdFromToken = async() => {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;

  if (!token) return null;

  try {
    const decoded = verifyAccessToken(token);
    return decoded.id; // assuming token has { id, role }
  } catch {
    return null;
  }
};
