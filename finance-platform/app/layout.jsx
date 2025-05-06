import { Poppins } from "next/font/google";
import Head from "next/head";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import QueryProviders from "@/providers/query-provider";
import SheetProvider from "@/providers/sheet-provider";

const poppins = Poppins({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "Fineance",
  description: "Finance dashboard for modern users",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Special+Gothic+Expanded+One&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className={`${poppins.variable} antialiased`}>
        <QueryProviders>
          <SheetProvider />
          {children}
        </QueryProviders>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}