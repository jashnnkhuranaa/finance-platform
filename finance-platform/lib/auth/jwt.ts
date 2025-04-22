// lib/auth/jwt.ts

import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access-secret';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh-secret';

export const signAccessToken = (payload: object) => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
};

export const signRefreshToken = (payload: object) => {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

export const verifyAccessToken = (token: string): { id: string; role: string } => {
  const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as { id: string; role: string };
  return decoded;
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, REFRESH_TOKEN_SECRET);
};

// setting auth cookies both access and refresh tokens
export const setAuthCookies = (res: NextResponse, accessToken: string, refreshToken: string) => {
  res.cookies.set('accessToken', accessToken, {
    httpOnly: true,
    secure: true,
    path: '/',
    maxAge: 60 * 15, // 15 minutes
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
