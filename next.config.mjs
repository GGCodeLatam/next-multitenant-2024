/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async rewrites() {
      return [
        {
          source: '/:path*',
          destination: '/:path*',
        },
        {
          source: '/app',
          destination: '/api/tenant',
        },
      ]
    },
  }
  
  export default nextConfig;
  