'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    });

    if (res.ok) {
      router.push('/login');
    } else {
      const data = await res.json();
      alert(data.error || 'Signup failed');
    }
  };

  return (
    <form onSubmit={handleSignup} className="max-w-md mx-auto mt-10 flex flex-col gap-4">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2"
      />
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="border p-2"
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      <button type="submit" className="bg-blue-600 text-white p-2">
        Sign Up
      </button>
    </form>
  );
}
