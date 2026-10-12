/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // eslint-config-next 15's @rushstack/eslint-patch rejects the pinned
  // eslint 9.17.0 ("calling module was not recognized"), so `next lint` —
  // and the lint pass `next build` runs by default — crash on this stack.
  // Lint is accepted as broken in this repo; typecheck is the gate (see
  // AGENTS.md), so skip lint during builds rather than fail the deploy.
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Keystatic resolves content relative to the repo root at runtime; keep the
  // traced files so local-mode reads/writes work in standalone deployments.
  outputFileTracingIncludes: {
    '/api/keystatic': ['./keystatic/**/*', './src/content/**/*'],
  },
};

module.exports = nextConfig;
