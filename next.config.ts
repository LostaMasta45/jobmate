import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gyamsjmrrntwwcqljene.supabase.co",
      },
      {
        protocol: "https",
        hostname: "seeklogo.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
  serverActions: {
    bodySizeLimit: "10mb", // Increased from default 1mb for CV with photos
  },
};

export default nextConfig;
