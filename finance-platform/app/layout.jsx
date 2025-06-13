import { Poppins, Special_Elite } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify"; // Switched to react-toastify
import "react-toastify/dist/ReactToastify.css"; // Add CSS for react-toastify
import QueryProviders from "@/providers/query-provider";
import SheetProvider from "@/providers/sheet-provider";

// Configure Poppins font
const poppins = Poppins({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

// Configure Special Elite font (closest match to Special Gothic Expanded One)
const specialElite = Special_Elite({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-special-elite",
});

export const metadata = {
  title: "Fineance",
  description: "Finance dashboard for modern users",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${specialElite.variable} antialiased`}>
        <QueryProviders>
          <SheetProvider />
          {children}
          <ToastContainer position="top-right" autoClose={3000} /> {/* Added ToastContainer */}
        </QueryProviders>
      </body>
    </html>
  );
}