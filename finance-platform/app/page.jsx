"use strict";
'use client';

import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import { motion } from "framer-motion";

const LandingPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 flex flex-col justify-center items-center text-white px-4 overflow-hidden">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center max-w-3xl z-10"
      >
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
          Welcome to Fineance
        </h1>
        <p className="text-lg md:text-2xl mb-10 text-blue-100 font-light">
          Empower your financial journey. Track transactions, manage accounts, and achieve your goals with ease.
        </p>
        <div className="flex justify-center gap-6">
          <Button
            onClick={() => router.push('/login')}
            className="bg-blue-500 text-white hover:bg-blue-400 font-semibold py-3 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Login
          </Button>
          <Button
            onClick={() => router.push('/signup')}
            className="bg-transparent border-2 border-blue-300 text-blue-100 hover:bg-blue-300 hover:text-blue-900 font-semibold py-3 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Sign Up
          </Button>
        </div>
      </motion.div>

      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-6 text-sm text-blue-200 opacity-90">
        © 2025 Fineance. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;