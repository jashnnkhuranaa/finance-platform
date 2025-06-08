'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Label from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      const data = await res.json();
      console.log('Login Response:', data);

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      console.log('Login successful, setting session and redirecting to /overview');
      const authCheck = await fetch('/api/auth/check', {
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      const authData = await authCheck.json();
      console.log('Post-login Auth Check:', authData);

      if (authData.isAuthenticated) {
        router.replace('/overview');
      } else {
        throw new Error('Session not set properly after login');
      }
    } catch (err) {
      console.error('Login Error:', err.message);
      toast.error(err.message, {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-blue-500 to-blue-300 flex justify-center items-center p-4">
      <Card className="w-full max-w-md bg-white/90 backdrop-blur-md shadow-2xl rounded-xl overflow-hidden transform transition-all duration-300 hover:shadow-3xl">
        <CardHeader className="bg-blue-600 text-white p-6">
          <CardTitle className="text-2xl md:text-3xl font-semibold text-center">Login</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Enter your email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Enter your password"
              />
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-all duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
          <div className="text-center">
            <Button
              variant="link"
              onClick={() => router.push('/forgot-password')}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Forgot Password?
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;