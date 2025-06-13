'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify"; // Switched to react-toastify
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";

function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (!email || !password) {
      setError('Please enter both email and password');
      toast.error('Please enter both email and password', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      toast.error('Password must be at least 6 characters', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, role: 'user' }),
    });
    const data = await res.json();
    if (res.ok) {
      toast.success('Signup successful! Please login', {
        position: 'top-right',
        autoClose: 3000,
      });
      router.push('/login');
    } else {
      const errorMessage = data.error ?? 'Signup failed';
      setError(errorMessage);
      toast.error(`Signup failed: ${errorMessage}`, {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Sign Up for Fineance</h1>
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1"
            />
          </div>
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            Sign Up
          </Button>
          {error && <p className="text-red-600 mt-2 text-center">{error}</p>}
        </form>
        <p className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;