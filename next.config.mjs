/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {

    unoptimized: process.env.NODE_ENV !== 'production',
    formats: ['image/avif', 'image/webp'],

    minimumCacheTTL: 31536000,
    qualities: [70, 75, 80, 85, 90],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'arena2battle.com',
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

export default nextConfig;