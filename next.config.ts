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
      // Exclude icons from precache to allow updates
      exclude: [/icons\/.*\.png$/],
      runtimeCaching: [
        {
          // Cache icons with network-first strategy for fresh updates
          urlPattern: /\/icons\/.*\.png$/,
          handler: "NetworkFirst",
          options: {
            cacheName: "pwa-icons",
            expiration: {
              maxEntries: 20,
              maxAgeSeconds: 60 * 60 * 24, // 1 day
            },
          },
        },
      ],
    },
  });
} catch {
  // Package not available in standalone build - this is expected
  console.log("PWA wrapper not available (standalone mode)");
}

// Forced rebuild for cache clearance: 2025-12-31 (logo update)
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
      {
        protocol: "https",
        hostname: "cdn-icons-png.flaticon.com",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
      },
    ],
    // unoptimized: process.env.NODE_ENV === 'development', // Enabled optimization in dev for testing speed
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
    serverComponentsExternalPackages: ['pdf-parse'],
    // Optimize package imports
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-select',
      '@radix-ui/react-tabs',
      '@radix-ui/react-accordion',
      '@radix-ui/react-avatar',
      '@radix-ui/react-checkbox',
      '@radix-ui/react-label',
      '@radix-ui/react-popover',
      '@radix-ui/react-progress',
      '@radix-ui/react-radio-group',
      '@radix-ui/react-scroll-area',
      '@radix-ui/react-separator',
      '@radix-ui/react-slider',
      '@radix-ui/react-slot',
      '@radix-ui/react-switch',
      '@radix-ui/react-toast',
      '@radix-ui/react-tooltip',
      'sonner',
      'date-fns',
      'clsx',
      'tailwind-merge',
      'recharts',
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
