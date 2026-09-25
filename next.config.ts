import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Branded 404 for unknown URLs (app/global-not-found.tsx). Recommended by the
    // Next.js docs when the root layout lives in a dynamic segment (app/[lang]).
    globalNotFound: true,
  },
};

export default nextConfig;
