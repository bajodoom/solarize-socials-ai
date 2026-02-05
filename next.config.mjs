/** @type {import('next').NextConfig} */
const nextConfig = {
  // TypeScript configuration
  typescript: {
    // Ensure TypeScript errors are caught during build
    ignoreBuildErrors: false,
  },
  
  // ESLint configuration
  eslint: {
    // Ensure ESLint errors are caught during build
    ignoreDuringBuilds: false,
  },
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // Routing configuration
  trailingSlash: false,
  
  // Enable React strict mode
  reactStrictMode: true,
  
  // Production optimizations
  poweredByHeader: false,
  compress: true,
  
  // Ensure experimental features are properly configured
  experimental: {
    // Enable server actions (required for Next.js 14+)
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;
  reactStrictMode: true,
};

export default nextConfig;
