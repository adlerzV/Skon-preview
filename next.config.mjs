/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'arena2battle.com',
      },
      {
        protocol: 'http',
        hostname: 'tazavesh.local',
      },
    ],
  },
};

export default nextConfig;