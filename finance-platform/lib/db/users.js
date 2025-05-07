const { createConnection } = require("./db");

async function getUserByEmail(email) {
  const conn = await createConnection();
  try {
    const [rows] = await conn.execute(
      "SELECT id, email, password, role, plaidId FROM users WHERE email = ?",
      [email]
    );
    const users = rows;
    return users[0] ? users[0] : null;
  } catch (error) {
    console.error("❌ Error fetching user by email:", error);
    return null;
  } finally {
    await conn.end();
  }
}

async function getUserById(id) {
  const conn = await createConnection();
  try {
    const [rows] = await conn.execute(
      "SELECT id, email, password, role, plaidId FROM users WHERE id = ?",
      [id]
    );
    const users = rows;
    return users[0] ? users[0] : null;
  } catch (error) {
    console.error("❌ Error fetching user by ID:", error);
    return null;
  } finally {
    await conn.end();
  }
}

async function createUser(email, password, role = "user") {
  const conn = await createConnection();
  try {
    const id = generateId(); // Simple ID generator (replace with UUID in production)
    await conn.execute(
      "INSERT INTO users (id, email, password, role) VALUES (?, ?, ?, ?)",
      [id, email, password, role]
    );
    return { id, email, password, role };
  } catch (error) {
    console.error("❌ Error creating user:", error);
    return null;
  } finally {
    await conn.end();
  }
}

function generateId() {
  return Math.random().toString(36).slice(2);
}

export { getUserByEmail, getUserById, createUser };
