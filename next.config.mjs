import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  output: 'standalone',

  cacheComponents: true,

  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  images: {
    unoptimized: process.env.NODE_ENV !== 'production',
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
    qualities: [70, 75, 80, 85, 90],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'arena2battle.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'tazavesh.local',
        pathname: '/**',
      },
    ],
  },

  async headers() {
    return [
      {
        source: '/avatars/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);