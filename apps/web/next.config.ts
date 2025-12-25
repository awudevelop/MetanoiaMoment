import createNextIntlPlugin from 'next-intl/plugin'
import bundleAnalyzer from '@next/bundle-analyzer'
import type { NextConfig } from 'next'

const withNextIntl = createNextIntlPlugin()

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig: NextConfig = {
  transpilePackages: ['@metanoia/ui'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
    // Enable modern image formats for better compression
    formats: ['image/avif', 'image/webp'],
    // Optimize device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb', // Allow large video uploads
    },
    // Optimize package imports - tree-shake large packages
    optimizePackageImports: ['lucide-react', '@metanoia/ui'],
  },
  // Enable compression
  compress: true,
  // Production source maps for debugging (optional - disable for smaller builds)
  productionBrowserSourceMaps: false,
  // Strict mode for better React practices
  reactStrictMode: true,
  // Powered by header removal for security
  poweredByHeader: false,
}

export default withBundleAnalyzer(withNextIntl(nextConfig))
