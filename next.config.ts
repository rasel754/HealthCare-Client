import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/forgot-password",
        destination: "/forget-password",
      },
    ];
  },
};

export default nextConfig;
