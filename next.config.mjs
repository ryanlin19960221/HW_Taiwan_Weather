/** @type {import('next').NextConfig} */
const isVercel = Boolean(process.env.VERCEL);
const isGitHubActions = process.env.GITHUB_ACTIONS === "true";
const isGhPages = !isVercel && (isGitHubActions || process.env.DEPLOY_TARGET === "gh-pages");
const repo = "HW_Taiwan_Weather";

const nextConfig = {
  output: "export",
  basePath: isGhPages ? `/${repo}` : "",
  assetPrefix: isGhPages ? `/${repo}/` : undefined,
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  reactStrictMode: true,
};

export default nextConfig;
