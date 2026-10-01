import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep the dev badge clear of the sidebar's Log out button (bottom-left).
  devIndicators: { position: "bottom-right" },
};

export default nextConfig;
