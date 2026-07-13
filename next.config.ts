import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: process.env.ALLOWED_ORIGINS?.split(",") || [],
  reactCompiler: true,
};

export default nextConfig;
