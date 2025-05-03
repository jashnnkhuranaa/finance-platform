'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useCookies } from 'react-cookie'; // Using react-cookie for client-side cookie management

const LandingPage = () => {
  const router = useRouter();
  const [cookies] = useCookies(['accessToken']); // Get accessToken from cookies

  // Redirect to /overview if user is logged in (accessToken exists)
  useEffect(() => {
    if (cookies.accessToken) {
      router.push('/overview');
    }
  }, [cookies, router]);

  // If user is logged in, don't render the landing page
  if (cookies.accessToken) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex flex-col justify-center items-center text-white px-4">
      {/* Hero Section */}
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">
          Welcome to Fineance
        </h1>
        <p className="text-lg md:text-xl mb-8">
          Take control of your finances with ease. Track your transactions, manage accounts, and achieve your financial goals!
        </p>
        <div className="flex justify-center gap-4">
          <Button
            onClick={() => router.push('/login')}
            className="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-3 px-6 rounded-lg transition"
          >
            Login
          </Button>
          <Button
            onClick={() => router.push('/signup')}
            className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold py-3 px-6 rounded-lg transition"
          >
            Sign Up
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 text-sm opacity-80">
        © 2025 Fineance. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;