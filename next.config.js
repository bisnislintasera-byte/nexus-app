/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'], // Local MinIO server
  },
  trailingSlash: false // Match FastAPI URL structure which doesn't use trailing slashes
}

module.exports = nextConfig