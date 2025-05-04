import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

// Explicitly load .env.local file
config({ path: '.env.local' });
import { cookies } from 'next/headers';

// Define the expected payload structure
interface TokenPayload {
  id: string;
  userId: string; // Add userId to the payload
  role: string;
  iat?: number;
  exp?: number;
}

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access-secret';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh-secret';

export const signAccessToken = (payload: { id: string; role: string }) => {
  return jwt.sign({ ...payload, userId: payload.id }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
};

export const signRefreshToken = (payload: { id: string; role: string }) => {
  return jwt.sign({ ...payload, userId: payload.id }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

export const verifyAccessToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    console.error('❌ Access token verification error:', error);
    return null;
  }
};

export const verifyRefreshToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    console.error('❌ Refresh token verification error:', error);
    return null;
  }
};

// Setting auth cookies both access and refresh tokens
export const setAuthCookies = (res: NextResponse, accessToken: string, refreshToken: string) => {
  res.cookies.set('accessToken', accessToken, {
    httpOnly: true,
    secure: true,
    path: '/',
    maxAge: 60 * 30, // 30 minutes
  });

  res.cookies.set('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return res;
};

export const clearAuthCookies = (res: NextResponse) => {
  res.cookies.set('accessToken', '', { path: '/', maxAge: 0 });
  res.cookies.set('refreshToken', '', { path: '/', maxAge: 0 });
  return res;
};