// test-db.js
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

import { createConnection } from "./lib/db/db.js";

async function test() {
  try {
    const connection = await createConnection();
    console.log("Connection successful!");
    await connection.end();
  } catch (error) {
    console.error("Connection failed:", error);
  }
}

test();