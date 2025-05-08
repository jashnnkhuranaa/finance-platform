// lib/db/users.js
import { createConnection } from "@/lib/db/db";

async function getUserByEmail(email) {
  const conn = await createConnection();
  try {
    console.log("Querying user by email:", email);
    const [rows] = await conn.execute(
      "SELECT id, email, password, role, plaidId FROM users WHERE email = ?",
      [email]
    );
    console.log("User query result:", rows);
    const user = rows[0] ? rows[0] : null;
    if (!user) {
      console.log("No user found with email:", email);
    }
    return user;
  } catch (error) {
    console.error("❌ Error fetching user by email:", error.message, error.stack);
    throw error; // Throw error to catch in login route
  } finally {
    await conn.end();
  }
}

async function getUserById(id) {
  const conn = await createConnection();
  try {
    console.log("Querying user by id:", id);
    const [rows] = await conn.execute(
      "SELECT id, email, password, role, plaidId FROM users WHERE id = ?",
      [id]
    );
    console.log("User query result:", rows);
    return rows[0] ? rows[0] : null;
  } catch (error) {
    console.error("❌ Error fetching user by ID:", error.message);
    throw error;
  } finally {
    await conn.end();
  }
}

async function createUser(email, password, role = "user") {
  const conn = await createConnection();
  try {
    const id = generateId();
    console.log("Creating user with email:", email);
    await conn.execute(
      "INSERT INTO users (id, email, password, role) VALUES (?, ?, ?, ?)",
      [id, email, password, role]
    );
    return { id, email, password, role };
  } catch (error) {
    console.error("❌ Error creating user:", error.message);
    throw error;
  } finally {
    await conn.end();
  }
}

function generateId() {
  return Math.random().toString(36).slice(2);
}

export { getUserByEmail, getUserById, createUser };