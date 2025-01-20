/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/:path*",
        destination: "https://psw-gift-2xvg.shuttle.app/:path*",
      },
    ];
  },
};

export default nextConfig;
