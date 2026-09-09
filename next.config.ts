import type { NextConfig } from 'next';

const onGitHubPages = process.env.GITHUB_ACTIONS === 'true';
const repositoryBase = '/ansi-coolness-app';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  ...(onGitHubPages
    ? {
        assetPrefix: repositoryBase,
      }
    : {}),
};

export default nextConfig;
