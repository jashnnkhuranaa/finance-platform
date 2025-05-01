
'use client';

import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Finance App</h1>
        <p className="text-muted-foreground mb-6">Please log in to access your dashboard.</p>
        <button
          onClick={handleLogin}
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-900"
        >
          Log In
        </button>
      </div>
    </div>
  );
}