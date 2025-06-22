'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Label from '@/components/ui/label';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('LoginPage mounted, checking render with background:', window.getComputedStyle(document.body).background);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please enter both email and password');
      toast.error('Please enter both email and password', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

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

      // Check if response is not JSON
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        console.error('Non-JSON response:', text.slice(0, 100));
        throw new Error('Server returned an invalid response');
      }

      const data = await res.json();
      console.log('API Response:', { status: res.status, data });

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Check session
      const authCheck = await fetch('/api/auth/check', {
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      if (!authCheck.headers.get('content-type')?.includes('application/json')) {
        const text = await authCheck.text();
        console.error('Non-JSON auth check response:', text.slice(0, 100));
        throw new Error('Invalid auth check response');
      }

      const authData = await authCheck.json();
      console.log('Auth Check Response:', authData);

      if (authData.isAuthenticated) {
        console.log('User is authenticated, redirecting to /overview');
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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex justify-center items-center">
      <Card className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>
            <div>
              <Label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </Button>
            {error && <p className="text-red-600 mt-2 text-center">{error}</p>}
          </form>
          <p className="mt-4 text-center text-sm">
            Create new account{' '}
            <Button
              variant="link"
              onClick={() => router.push('/signup')}
              className="text-blue-600 hover:underline"
            >
              Sign Up
            </Button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;