import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables (support .env.local for local dev)
dotenv.config({ path: process.env.NODE_ENV === 'production' ? '.env' : '.env.local' });

let pool;

// Initialize connection pool with error handling for CA certificate
try {
  let caCert;
  const caPath = path.join(process.cwd(), 'certs/ca.pem');
  console.log('Attempting to load CA certificate from:', caPath);

  // Try loading CA certificate from file
  if (fs.existsSync(caPath)) {
    console.log('✅ CA certificate found at:', caPath);
    caCert = fs.readFileSync(caPath);
  } else {
    console.log('⚠️ CA certificate file not found at:', caPath);
    // Fallback to DB_CA_CERT environment variable
    if (process.env.DB_CA_CERT) {
      console.log('✅ Using DB_CA_CERT environment variable');
      caCert = process.env.DB_CA_CERT.replace(/\\n/g, '\n');
    } else {
      throw new Error('No CA certificate found in certs/ca.pem or DB_CA_CERT environment variable');
    }
  }

  // Log environment variables for debugging (hide sensitive data)
  console.log('DB Config:', {
    DB_HOST: process.env.DB_HOST || 'undefined',
    DB_PORT: process.env.DB_PORT || 'undefined',
    DB_USER: process.env.DB_USER || 'undefined',
    DB_NAME: process.env.DB_NAME || 'undefined',
    DB_CA_CERT_SET: !!process.env.DB_CA_CERT,
  });

  // Create connection pool
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    ssl: { ca: caCert, rejectUnauthorized: true },
    connectionLimit: 20, // Max 20 connections
    connectTimeout: 30000, // 30 seconds timeout
  });

  console.log('✅ MySQL connection pool initialized');
} catch (error) {
  console.error('❌ Error initializing MySQL pool:', error.message, { stack: error.stack });
  throw error;
}

async function createConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connected to MySQL');
    return connection;
  } catch (error) {
    console.error('❌ Error getting connection from pool:', error.message, {
      stack: error.stack,
      envVars: {
        DB_HOST: process.env.DB_HOST,
        DB_PORT: process.env.DB_PORT,
        DB_CA_CERT_SET: !!process.env.DB_CA_CERT,
      },
    });
    throw error;
  }
}

export { createConnection };