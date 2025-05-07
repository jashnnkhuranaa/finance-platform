const jwt = require("jsonwebtoken");

// Environment variables for secrets
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "access-secret";

// Sign Access Token (No expiration)
const signAccessToken = (payload) => {
  const tokenPayload = { ...payload, userId: payload.id };
  return jwt.sign(tokenPayload, ACCESS_TOKEN_SECRET);
};

// Verify Access Token
const verifyAccessToken = (token) => {
  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    console.log("Access Token Decoded:", decoded);
    return decoded;
  } catch (error) {
    console.error("❌ Access token verification error:", error.message);
    return { error: "Invalid token" };
  }
};

// Set Auth Cookie (Single cookie, no expiration)
const setAuthCookies = (res, accessToken) => {
  res.cookies.set("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Ensure false in development
    path: "/",
    sameSite: "strict",
  });
  console.log("Auth Cookie Set:", { accessToken });
  return res;
};

// Clear Auth Cookie
const clearAuthCookies = (res) => {
  res.cookies.set("accessToken", "", {
    path: "/",
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  console.log("Auth Cookie Cleared");
  return res;
};

export { signAccessToken, verifyAccessToken, setAuthCookies, clearAuthCookies };
