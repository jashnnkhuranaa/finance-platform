/** @type {import('next').NextConfig} */
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const nextConfig = {
  // Enable React Strict Mode for better error detection
  reactStrictMode: true,

  // Define path aliases to match jsconfig.json
  webpack(config) {
    config.resolve.alias["@"] = resolve(__dirname);
    return config;
  },

  // Enable SWC minification for better performance
  // swcMinify: true,

  // Optional: Add image domains if you're using next/image
  images: {
    domains: ["localhost"], // Add domains if you're loading external images
  },
};

export default nextConfig;