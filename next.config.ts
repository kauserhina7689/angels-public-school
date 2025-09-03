import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */ images: {
    // remotePatterns: [new URL("https://res.cloudinary.com")],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    },
  },
};

export default nextConfig;
