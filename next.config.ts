import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // REMOVED: output: "standalone" 
  // Reason: Vercel tidak perlu ini (punya build system sendiri)
  // Docker tetap bisa jalan tanpa ini (image sedikit lebih besar tapi OK)
  
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gyamsjmrrntwwcqljene.supabase.co",
        pathname: "/storage/v1/object/public/**",
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
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
    unoptimized: process.env.NODE_ENV === 'development',
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // Increased from default 1mb for CV with photos
    },
  },
};

export default nextConfig;
