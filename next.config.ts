import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/ctk-ui-prototype",
  images: { unoptimized: true },
};

export default nextConfig;
