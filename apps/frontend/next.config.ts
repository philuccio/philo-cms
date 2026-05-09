import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    localPatterns: [{ pathname: '/uploads/**' }],
  },
  serverActions: {
    bodySizeLimit: '50mb',
  },
  typedRoutes: true,
}

export default nextConfig
