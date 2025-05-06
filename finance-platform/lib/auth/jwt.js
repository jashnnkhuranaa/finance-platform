const jwt = require("jsonwebtoken");

// Environment variables for secrets
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "access-secret";
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "refresh-secret";

// Sign Access Token
const signAccessToken = (payload) => {
  const tokenPayload = { ...payload, userId: payload.id };
  return jwt.sign(tokenPayload, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
};

// Sign Refresh Token
const signRefreshToken = (payload) => {
  const tokenPayload = { ...payload, userId: payload.id };
  return jwt.sign(tokenPayload, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

// Verify Access Token
const verifyAccessToken = (token) => {
  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    console.log("Access Token Decoded:", decoded);
    return decoded;
  } catch (error) {
    console.error("❌ Access token verification error:", error);
    return null;
  }
};

// Verify Refresh Token
const verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);
    console.log("Refresh Token Decoded:", decoded);
    return decoded;
  } catch (error) {
    console.error("❌ Refresh token verification error:", error);
    return null;
  }
};

// Set Auth Cookies
const setAuthCookies = (res, accessToken, refreshToken) => {
  res.cookies.set("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Ensure false in development
    path: "/",
    sameSite: "strict",
    maxAge: 60 * 15, // 15 minutes
  });
  res.cookies.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Ensure false in development
    path: "/",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  console.log("Auth Cookies Set:", { accessToken, refreshToken });
  return res;
};

// Clear Auth Cookies
const clearAuthCookies = (res) => {
  res.cookies.set("accessToken", "", {
    path: "/",
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.cookies.set("refreshToken", "", {
    path: "/",
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  console.log("Auth Cookies Cleared");
  return res;
};

export {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  setAuthCookies,
  clearAuthCookies,
};
