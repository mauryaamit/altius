import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/pulse',
        destination: '/digest',
        permanent: true,
      },
      {
        source: '/bites',
        destination: '/insights',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
