import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    rules: {
      // Configure SVG import handling for Turbopack
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "component",
      },
    },
  },
};

export default nextConfig;
