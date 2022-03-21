/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'f8n-production-collection-assets.imgix.net',
      'f8n-ipfs-production.imgix.net'
    ],
  },
}

module.exports = nextConfig
