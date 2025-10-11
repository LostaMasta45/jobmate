import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gyamsjmrrntwwcqljene.supabase.co",
      },
    ],
  },
};

export default nextConfig;
