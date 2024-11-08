/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/games/:gameId/:gameName*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/games/:gameId/:gameName*`,
      },
      {
        source: '/users/:userId/profile',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/users/:userId/profile`,
      },
      {
        source: '/groups/:groupId/:groupName*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/groups/:groupId/:groupName*`,
      },
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL + '/:path*',
      }
    ];
  },
};

module.exports = nextConfig; 