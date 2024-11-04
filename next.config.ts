// next.config.ts
import type { NextConfig } from 'next';
import i18nConfig from './src/i18n/next-i18next.config';

const nextConfig: NextConfig = {
  ...i18nConfig,
  // other Next.js configurations if needed
};

export default nextConfig;
