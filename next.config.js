/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'lh3.googleusercontent.com',
            port: '',
            pathname: '/a/**',
          },
          {
            protocol: 'https',
            hostname: 'ui-avatars.com',
            port: '',
            pathname: '/api/**',
          },{
            protocol: 'https',
            hostname: 'avatars.githubusercontent.com',
            port: '',
            pathname: '/u/**',
          },
          {
            protocol: 'https',
            hostname: 'cdn.discordapp.com',
            port: '',
            pathname: '/embed/avatars/**',
          },
        ],
      }
    
}

module.exports = nextConfig
