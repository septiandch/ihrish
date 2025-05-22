import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config) {
    // Configures webpack to handle SVG files using SVGR
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
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
