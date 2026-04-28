import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // GitHub Pages serves from /portfolio-3d/ subpath
  // Change to '/' if using a custom domain or username.github.io repo
  basePath: "/portfolio-3d",
  // Disable image optimization (not supported with static export)
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
