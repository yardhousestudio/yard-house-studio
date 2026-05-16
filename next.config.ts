import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Picsum — placeholder photos used during Stage A seed.
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
      // Supabase Storage public bucket for the media library.
      { protocol: "https", hostname: "rgyyhxtygkkmcmmvmzhf.supabase.co" },
    ],
  },
  // In dev, force browsers to always refetch — Turbopack reuses chunk URLs
  // across rebuilds, so browser cache otherwise serves stale CSS.
  async headers() {
    if (!isDev) return [];
    return [
      {
        source: "/:path*",
        headers: [{ key: "Cache-Control", value: "no-store, must-revalidate" }],
      },
    ];
  },
};

export default nextConfig;
