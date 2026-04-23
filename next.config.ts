import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    serverExternalPackages: ['onnxruntime-node'],
};

export default nextConfig;
