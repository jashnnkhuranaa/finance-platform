import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

if (!ACCESS_TOKEN_SECRET) {
  throw new Error("ACCESS_TOKEN_SECRET not set in environment variables");
}

const signAccessToken = (payload) => {
  const tokenPayload = { ...payload, userId: payload.id };
  console.log("Signing access token with payload:", tokenPayload);
  const token = jwt.sign(tokenPayload, ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
  console.log("Access token signed successfully:", token);
  return token;
};

const verifyAccessToken = (token) => {
  try {
    console.log("Verifying access token:", token);
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    console.log("Access token verified successfully, decoded:", decoded);
    return decoded;
  } catch (error) {
    console.error("❌ Access token verification error:", error.message);
    return null;
  }
};

const setAuthCookies = (res, accessToken) => {
  console.log("Setting auth cookies with token:", accessToken);
  res.cookies.set("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
    path: "/",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    maxAge: 3600 * 1000, // 1 hour
  });
  console.log("Auth Cookie Set:", { accessToken });
  return res;
};

const clearAuthCookies = (res) => {
  res.cookies.set("accessToken", "", {
    path: "/",
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
  });
  console.log("Auth Cookie Cleared");
  return res;
};

export { signAccessToken, verifyAccessToken, setAuthCookies, clearAuthCookies };