import type { NextConfig } from "next";

/**
 * Next.js config for the portfolio site.
 *
 * `output: "export"` makes `next build` write plain static files to `out/`,
 * one HTML file per page plus `404.html`, as PCR-0001 requires. No page may
 * rely on a server at request time; a feature that does fails the build.
 */
const nextConfig: NextConfig = {
  output: "export",
};

export default nextConfig;
