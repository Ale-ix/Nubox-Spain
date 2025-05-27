const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['firebasestorage.googleapis.com'],
    unoptimized: true,
  },
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
}

export default nextConfig
