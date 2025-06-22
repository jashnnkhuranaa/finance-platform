// lib/db/db.js
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import mysql from "mysql2/promise";

async function createConnection() {
  try {
    console.log("DB_HOST:", process.env.DB_HOST || "localhost");
    console.log("DB_USER:", process.env.DB_USER || "root");
    console.log("DB_PASSWORD:", process.env.DB_PASSWORD || "NO_PASSWORD");
    console.log("DB_NAME:", process.env.DB_NAME || "myprojectdb");
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST ,
      user: process.env.DB_USER ,
      password: process.env.DB_PASSWORD ,
      database: process.env.DB_NAME ,
    });
    console.log("✅ Connected to MySQL database");
    return connection;
  } catch (error) {
    console.error("❌ Error connecting to MySQL:", error);
    throw error;
  }
}

export { createConnection };