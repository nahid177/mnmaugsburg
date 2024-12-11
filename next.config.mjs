/** @type {import('next').NextConfig} */
const nextConfig = {

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'forum-web-storage.s3.us-east-1.amazonaws.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'afwanimage.s3.us-east-1.amazonaws.com',
        pathname: '/**',
      },
    ],
    
    },
    async headers() {
      return [
        {
          source: '/(.*)', // Adjust the source pattern as needed
          headers: [
            {
              key: 'Cache-Control',
              value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
            },
          ],
        },
      ];
    },
};

export default nextConfig;
