/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    outputFileTracingIncludes: {
      '/*': ['./node_modules/.prisma/client/**/*'],
    },
  },
};

export default nextConfig;
