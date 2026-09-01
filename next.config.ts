import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
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
