import type { NextConfig } from "next";

// PWA Configuration - conditionally loaded to avoid MODULE_NOT_FOUND in Docker standalone
let withPWA: (config: NextConfig) => NextConfig = (config) => config;

try {
  // Only load PWA wrapper during build time, not in standalone runtime
  // In Docker standalone, this package won't be available
  const withPWAInit = require("@ducanh2912/next-pwa").default;
  withPWA = withPWAInit({
    dest: "public",
    register: true,
    disable: process.env.NODE_ENV === "development",
    fallbacks: {
      document: "/offline",
    },
    cacheOnFrontEndNav: true,
    reloadOnOnline: true,
    workboxOptions: {
      disableDevLogs: true,
      skipWaiting: true,
      clientsClaim: true,
    },
  });
} catch {
  // Package not available in standalone build - this is expected
  console.log("PWA wrapper not available (standalone mode)");
}

// Forced rebuild for cache clearance: 2025-11-28
const nextConfig: NextConfig = {
  // Required for Docker standalone deployment
  output: "standalone",

  // Compression for better performance
  compress: true,

  // Production source maps (disable untuk faster build & smaller bundle)
  productionBrowserSourceMaps: false,

  // Optimize for mobile-first
  poweredByHeader: false,

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
    minimumCacheTTL: 7200, // 2 hours for aggressive caching
    deviceSizes: [640, 750, 828, 1080, 1200], // Reduced sizes for mobile-first
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Added 384 for better thumbnail sizing
    formats: ['image/webp'], // Force WebP for better compression
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Loader config for better optimization
    loader: 'default',
  },

  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // Increased from default 1mb for CV with photos
    },
    // Optimize package imports
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-select',
      '@radix-ui/react-tabs',
    ],
  },

  // Webpack optimizations
  webpack: (config, { dev, isServer, webpack }) => {
    // Polyfill for Edge Runtime (required by @supabase/supabase-js and realtime-js)
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.version': JSON.stringify(process.version || 'v18.0.0'),
        'global': 'globalThis',
      })
    );

    // Add fallbacks for Node.js modules not available in Edge Runtime
    config.resolve.fallback = {
      ...config.resolve.fallback,
      ws: false,
      crypto: false,
      stream: false,
      http: false,
      https: false,
      zlib: false,
      net: false,
      tls: false,
    };

    // Production optimizations only
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Vendor chunk for node_modules
            vendor: {
              name: 'vendor',
              chunks: 'all',
              test: /node_modules/,
              priority: 20,
            },
            // Separate chunk for framer-motion (heavy library)
            framer: {
              name: 'framer',
              test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
              chunks: 'all',
              priority: 30,
            },
            // Separate chunk for Radix UI
            radix: {
              name: 'radix',
              test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
              chunks: 'all',
              priority: 30,
            },
            // Separate chunk for PDF libraries
            pdf: {
              name: 'pdf',
              test: /[\\/]node_modules[\\/](html2canvas|jspdf|html2pdf)[\\/]/,
              chunks: 'async', // Lazy load PDF libraries
              priority: 25,
            },
            // Separate chunk for chart libraries
            charts: {
              name: 'charts',
              test: /[\\/]node_modules[\\/](recharts|apexcharts)[\\/]/,
              chunks: 'async', // Lazy load charts
              priority: 25,
            },
            // Common chunk for shared code
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 10,
              reuseExistingChunk: true,
              enforce: true,
            },
          },
        },
      }
    }
    return config
  },

  // Headers for caching and security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=60, stale-while-revalidate=120',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
};

export default withPWA(nextConfig);
