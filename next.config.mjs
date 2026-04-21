/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'iobafnykjghgjfoysqnq.supabase.co',
      },
    ],
  },
};
export default nextConfig;