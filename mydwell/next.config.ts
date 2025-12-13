import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "9092",
        pathname: "/api/images/**",
      },
    ],
  },
};

export default nextConfig;
