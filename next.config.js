/** @type {import('next').NextConfig} */
// const nextConfig = {};

// module.exports = nextConfig;

module.exports = {
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
};
