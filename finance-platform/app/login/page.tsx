'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast, Toaster } from 'react-hot-toast';
import { AuthResponse } from '@/types/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(''); // Explicitly type as string | null
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch('/api/auth/check', { credentials: 'include' });
      const data: { isAuthenticated: boolean } = await res.json();
      if (data.isAuthenticated) {
        setIsAuthenticated(true);
        router.push('/overview');
      }
    };
    checkAuth();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Reset error to null

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });

    if (res.ok) {
      toast.success('Login successful!');
      setTimeout(async () => {
        const authRes = await fetch('/api/auth/check', { credentials: 'include' });
        const authData: { isAuthenticated: boolean } = await authRes.json();
        if (authData.isAuthenticated) {
          setIsAuthenticated(true);
          router.push('/overview');
        } else {
          setError('Authentication failed after login');
          toast.error('Authentication failed after login');
        }
      }, 500);
    } else {
      const data: AuthResponse = await res.json();
      const errorMessage = data.error ?? 'Login failed'; // Convert undefined/null to string
      setError(errorMessage);
      toast.error(`Login failed: ${errorMessage}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Login to Fineance</h1>
        <form onSubmit={handleLogin} className="space-y-4">
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
          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
            Log In
          </Button>
          {error && <p className="text-red-600 mt-2 text-center">{error}</p>}
        </form>
        <p className="mt-4 text-center text-sm">
          Don’t have an account?{' '}
          <a href="/signup" className="text-blue-600 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}