// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'forum-web-storage.s3.us-east-1.amazonaws.com',
        pathname: '/**', // Allow all paths
      },
      // Add more patterns if needed
    ],
  },
  // Other Next.js configurations can go here
};

export default nextConfig;
