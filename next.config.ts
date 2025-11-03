import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // === REACT ===
  reactStrictMode: true,

  // === TYPESCRIPT ===
  typescript: {
    tsconfigPath: './tsconfig.json',
    // ❌ PAS typedRoutes ici!
  },

  // === IMAGES ===
  images: {
    formats: ['image/webp', 'image/avif'],
    unoptimized: process.env.NODE_ENV === 'development',
  },

  // === EXPERIMENTAL (Fonctionnalités bêta) ===
  experimental: {
    typedRoutes: true,    // ✅ Ici! Pas dans typescript
    typedEnv: true,
  },

  // === SÉCURITÉ ===
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
        ],
      },
    ]
  },
}

export default nextConfig
