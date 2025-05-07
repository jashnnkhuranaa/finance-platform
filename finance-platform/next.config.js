/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React Strict Mode for better error detection
  reactStrictMode: true,

  // Define path aliases to match jsconfig.json
  webpack(config) {
    config.resolve.alias["@"] = require("path").resolve(__dirname);
    return config;
  },

  // Enable SWC minification for better performance
  // swcMinify: true,

  // Optional: Add image domains if you're using next/image
  images: {
    domains: ["localhost"], // Add domains if you're loading external images
  },
};

module.exports = nextConfig;
