import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';

// 👇 Import manually from Google Fonts
import Head from "next/head";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { Poppins } from 'next/font/google';
import { QueryProviders } from "@/providers/query-provider";
import { SheetProvider } from "@/providers/sheet-provider";

const poppins = Poppins({
  weight: ['400', '700'], // 400 = normal, 700 = bold
  subsets: ['latin'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: "Fineance",
  description: "Finance dashboard for modern users",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Special+Gothic+Expanded+One&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <QueryProviders>
            <SheetProvider />
          {children}
          </QueryProviders>
          
          <Toaster position="top-right" />
        </body>
      </html>
  );
}


