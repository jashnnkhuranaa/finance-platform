'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Label from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

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
      // Ensure session is set by calling auth check after login
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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-600 mb-4">{error}</p>}
            <Button type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;