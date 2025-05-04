'use client'; // Since CookiesProvider is client-side

import { Header } from "@/components/Header";
import { CookiesProvider } from 'react-cookie';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

const DashboardLayout = ({ children }: Props) => {
  return (
    <CookiesProvider>
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="flex-1 px-3 lg:px-14 py-8">
          {children}
        </main>
      </div>
    </CookiesProvider>
  );
};

export default DashboardLayout;