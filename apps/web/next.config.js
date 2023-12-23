/** @type {import('next').NextConfig} */
// const nextConfig = {};

// module.exports = nextConfig;

const withPWA = require('next-pwa')({
  dest: 'public',
});

module.exports = withPWA({
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gclzfhnchcgtgcmzpvna.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/images/**',
      },
    ],
    domains: ['gclzfhnchcgtgcmzpvna.supabase.co', 'localhost'],
  },
  transpilePackages: ['api', 'supabase'],
  // logging: {
  //   fetches: {
  //     fullUrl: true,
  //   },
  // },
});
