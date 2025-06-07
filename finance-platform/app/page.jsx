"use strict";
'use client';

import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import { motion } from "framer-motion";

const LandingPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-blue-600 flex flex-col justify-center items-center text-white px-6 overflow-hidden">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="text-center max-w-4xl z-10"
      >
        <h1 className="text-5xl md:text-7xl font-poppins font-bold mb-6 leading-tight text-white">
          Welcome to Fineance
        </h1>
        <p className="text-xl md:text-2xl mb-12 text-white font-poppins font-light max-w-2xl mx-auto">
          Embark on a journey of financial mastery. Effortlessly manage your wealth, track your endeavors, and realize your aspirations with elegance.
        </p>
      </motion.div>

      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-80 h-80 bg-blue-200 rounded-full mix-blend-overlay filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-100 rounded-full mix-blend-overlay filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-300 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      {/* Footer with Buttons */}
      <footer className="absolute bottom-8 flex gap-6">
        <Button
          onClick={() => router.push('/login')}
          className="bg-blue-500 text-white hover:bg-blue-400 font-poppins text-lg py-3 px-8 rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
        >
          Login
        </Button>
        <Button
          onClick={() => router.push('/signup')}
          className="bg-transparent border-2 border-blue-100 text-blue-100 hover:bg-blue-100 hover:text-blue-900 font-poppins text-lg py-3 px-8 rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
        >
          Sign Up
        </Button>
      </footer>

      {/* Subtle Overlay for Depth */}
      <div className="absolute inset-0 bg-blue-800 opacity-5 pointer-events-none"></div>
    </div>
  );
};

export default LandingPage;