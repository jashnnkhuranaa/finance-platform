'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CookiesProvider } from 'react-cookie';
import Header from '@/components/Header';

// Create a QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function DashboardLayout({ children }) {
  return (
    <CookiesProvider>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-gray-100">
          <Header />
          <main className="container mx-auto px-4 py-6">
            {children}
          </main>
        </div>
      </QueryClientProvider>
    </CookiesProvider>
  );
}