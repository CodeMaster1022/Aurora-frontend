/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ['natalia3-backend.vercel.app', 'res.cloudinary.com', 'i.pravatar.cc'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://aurora-backend-three.vercel.app/api',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://aurora-backend-three.vercel.app/api/:path*',
      },
    ];
  },
}

export default nextConfig
