import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,

  images: {
    unoptimized: true,
  },

  compress: true,

  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',

  experimental: {
    optimizePackageImports: [
      '@radix-ui/react-icons',
      '@tabler/icons-react',
      'lucide-react'
    ],
  },

};

export default nextConfig;
