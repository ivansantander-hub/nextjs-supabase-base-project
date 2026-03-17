import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    turbopack: {},
  },
};

export default nextConfig;
