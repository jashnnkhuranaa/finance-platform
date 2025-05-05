//lib/auth/jwt.ts

import { sign, verify } from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { config } from 'dotenv';

// Explicitly load .env.local file
config({ path: '.env.local' });

// Define payload types for access and refresh tokens
interface AccessTokenPayload {
  id: string;
  userId: string;
  role: string;
  iat?: number;
  exp?: number;
}

interface RefreshTokenPayload {
  id: string;
  userId: string;
  role?: string;
  iat?: number;
  exp?: number;
}

// Environment variables for secrets
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access-secret';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh-secret';

// Sign Access Token
export const signAccessToken = (payload: { id: string; role: string }) => {
  const tokenPayload = { ...payload, userId: payload.id };
  return sign(tokenPayload, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
};

// Sign Refresh Token
export const signRefreshToken = (payload: { id: string; role?: string }) => {
  const tokenPayload = { ...payload, userId: payload.id };
  return sign(tokenPayload, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

// Verify Access Token
export const verifyAccessToken = (token: string): AccessTokenPayload | null => {
  try {
    const decoded = verify(token, ACCESS_TOKEN_SECRET) as AccessTokenPayload;
    console.log('Access Token Decoded:', decoded);
    return decoded;
  } catch (error) {
    console.error('❌ Access token verification error:', error);
    return null;
  }
};

// Verify Refresh Token
export const verifyRefreshToken = (token: string): RefreshTokenPayload | null => {
  try {
    const decoded = verify(token, REFRESH_TOKEN_SECRET) as RefreshTokenPayload;
    console.log('Refresh Token Decoded:', decoded);
    return decoded;
  } catch (error) {
    console.error('❌ Refresh token verification error:', error);
    return null;
  }
};

// Set Auth Cookies
export const setAuthCookies = (res: NextResponse, accessToken: string, refreshToken: string) => {
  res.cookies.set('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Ensure false in development
    path: '/',
    sameSite: 'strict',
    maxAge: 60 * 15, // 15 minutes
  });

  res.cookies.set('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Ensure false in development
    path: '/',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  console.log('Auth Cookies Set:', { accessToken, refreshToken });
  return res;
};

// Clear Auth Cookies
export const clearAuthCookies = (res: NextResponse) => {
  res.cookies.set('accessToken', '', {
    path: '/',
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  res.cookies.set('refreshToken', '', {
    path: '/',
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  console.log('Auth Cookies Cleared');
  return res;
};