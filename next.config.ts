import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Die App ist privat. Sie gehört nicht in einen Index.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
