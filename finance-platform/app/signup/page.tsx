'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, role: 'user' }), // 👈 defaulting role here
    });

    const data = await res.json();

    if (res.ok) {
      toast.success('Signup successful! Please login');
      router.push('/login');
    } else {
      setError(data.error || 'Signup failed');
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
      <button type="submit" className="bg-blue-600 text-white p-2">
        Sign Up
      </button>
      {error && <p className="text-red-600">{error}</p>}
    </form>
  );
}
