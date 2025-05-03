'use client'; // Since CookiesProvider is client-side

import { Header } from "@/components/Header";
import { CookiesProvider } from 'react-cookie'; // Added CookiesProvider
import { ReactNode } from 'react'; // For type safety

type Props = {
  children: ReactNode;
};

const DashboardLayout = ({ children }: Props) => {
  return (
    <CookiesProvider> {/* Wrapped with CookiesProvider */}
      {/* <Header /> */}
      <main className="px-3 lg:px-14">
        {children}
      </main>
    </CookiesProvider>
  );
};

export default DashboardLayout;