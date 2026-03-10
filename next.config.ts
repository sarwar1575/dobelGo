/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3000/api/:path*', // Backend server
      },
      {
        source: '/uploads/:path*',
        destination: 'http://localhost:3000/uploads/:path*', // Proxy for images to avoid CORS/CORP issues
      },
    ]
  },
}

module.exports = nextConfig
