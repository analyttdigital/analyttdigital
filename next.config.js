/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Keystatic resolves content relative to the repo root at runtime; keep the
  // traced files so local-mode reads/writes work in standalone deployments.
  outputFileTracingIncludes: {
    '/api/keystatic': ['./keystatic/**/*', './src/content/**/*'],
  },
};

module.exports = nextConfig;
