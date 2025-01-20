const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

export default withBundleAnalyzer({
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com'
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com'
      }
    ]
  }
});
