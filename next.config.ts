// next.config.ts
import type { NextConfig } from 'next';
import i18nConfig from './src/i18n/next-i18next.config';

const nextConfig: NextConfig = {
  ...i18nConfig,
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
