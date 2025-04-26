import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    turbo: {
      rules: {
        // Configure SVG import handling for Turbopack
        "*.svg": {
          loaders: ["@svgr/webpack"],
          as: "component",
        },
      },
    },
  },
};

export default nextConfig;
