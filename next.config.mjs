/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // 👇 adiciona este trecho
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: '/', // redireciona todas as rotas pro React Router
      },
    ];
  },
};

export default nextConfig;
