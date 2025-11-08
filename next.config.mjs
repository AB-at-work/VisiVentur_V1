/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  outputFileTracingIncludes: {
    '/*': ['./node_modules/.prisma/client/**/*'],
  },
};

export default nextConfig;
