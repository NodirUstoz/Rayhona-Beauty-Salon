/** @type {import('next').NextConfig} */
// NOTE: Google Script URL moved to environment variables for security
// Set NEXT_PUBLIC_GOOGLE_SCRIPT_URL in your .env.local file

const nextConfig = {
  reactStrictMode: true,
  // Environment variables are automatically loaded from .env.local
  // Use process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL in your components
}

module.exports = nextConfig