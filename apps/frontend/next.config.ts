import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    // File serviti localmente da public/uploads/ — nessun dominio remoto richiesto
    localPatterns: [{ pathname: '/uploads/**' }],
  },
  typedRoutes: true,
}

export default nextConfig
