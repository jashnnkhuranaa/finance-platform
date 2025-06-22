// lib/db/db.js
// import dotenv from "dotenv";
// dotenv.config({ path: ".env.local" });
// import mysql from "mysql2/promise";

// async function createConnection() {
//   try {
//     console.log("DB_HOST:", process.env.DB_HOST || "localhost");
//     console.log("DB_USER:", process.env.DB_USER || "root");
//     console.log("DB_PASSWORD:", process.env.DB_PASSWORD || "NO_PASSWORD");
//     console.log("DB_NAME:", process.env.DB_NAME || "myprojectdb");
//     const connection = await mysql.createConnection({
//       host: process.env.DB_HOST ,
//       user: process.env.DB_USER ,
//       password: process.env.DB_PASSWORD ,
//       database: process.env.DB_NAME ,
//       port: process.env.DB_PORT,
//     });
//     console.log("✅ Connected to MySQL database");
//     return connection;
//   } catch (error) {
//     console.error("❌ Error connecting to MySQL:", error);
//     throw error;
//   }
// }

// export { createConnection };





import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

let caCert;
try {
  const certPath = path.join(process.cwd(), 'certs/ca.pem');
  caCert = fs.readFileSync(certPath);
  console.log('✅ CA Certificate loaded');
} catch (error) {
  console.error('❌ Error loading CA certificate:', error);
  throw error;
}

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT, 10),
  ssl: { ca: caCert, rejectUnauthorized: true },
  connectionLimit: 20, // Max 20 connections
  connectTimeout: 30000,
});

async function createConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connected to MySQL');
    return connection;
  } catch (error) {
    console.error('❌ Error getting connection:', error);
    throw error;
  }
}

export { createConnection };