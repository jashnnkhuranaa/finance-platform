// lib/db/users.ts

export type Role = 'admin' | 'user';

export interface User {
  id: string;
  email: string;
  password: string; // Hashed password
  role: Role;
}

// Mock users DB
export const users: User[] = [];
