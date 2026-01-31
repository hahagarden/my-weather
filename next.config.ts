import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  logging: {
    fetches: {
      fullUrl: true, // 터미널 로그에 fetch 캐시 여부(HIT/MISS)를 직접 출력
    },
  },
};

export default nextConfig;
