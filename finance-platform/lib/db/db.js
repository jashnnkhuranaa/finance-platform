// lib/db/db.js
const mysql = require("mysql2/promise");

async function createConnection() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "finance_tracker",
    });
    console.log("✅ Connected to MySQL database");
    return connection;
  } catch (error) {
    console.error("❌ Error connecting to MySQL:", error);
    throw error;
  }
}

export { createConnection };
