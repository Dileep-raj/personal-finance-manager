import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  allowedDevOrigins: process.env.ALLOWED_ORIGINS?.split(",") || [],
  reactCompiler: true,
};

export default nextConfig;
