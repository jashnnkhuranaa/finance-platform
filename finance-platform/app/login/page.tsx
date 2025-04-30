'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');  // Reset error on each submit attempt

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // ✅ Add this header
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include', // ✅ important!
    });

    if (res.ok) {
      // Redirect to the dashboard after successful login
      router.push('/');
      console.log('Login response status:', res.status);
      console.log('Login response ok:', res.ok);
    } else {
      // Get the error message from the response
      const data = await res.json();
      setError(data.error || 'Login failed');  // Set error message for UI display
    }
  };

  return (
    <form onSubmit={handleLogin} className="max-w-md mx-auto mt-10 flex flex-col gap-4">
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
      <button type="submit" className="bg-green-600 text-white p-2">
        Log In
      </button>
      {error && <p className="text-red-600 mt-2">{error}</p>} {/* Show error message */}
    </form>
  );
}
