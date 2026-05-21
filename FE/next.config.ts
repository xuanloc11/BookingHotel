import type { NextConfig } from "next";

const backendOrigin = process.env.BACKEND_ORIGIN ?? "http://127.0.0.1:8000";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false, // Ẩn header X-Powered-By: Next.js
  async rewrites() {
    return [
      {
        source: "/api/backend/:path*",
        destination: `${backendOrigin}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
