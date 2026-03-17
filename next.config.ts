import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack se activa automáticamente con: next dev --turbopack
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default nextConfig;
