import type { NextConfig } from 'next';

const securityHeaders = [
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
];

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 82, 84, 86],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'tkdqamzaqarmfoxxtypw.supabase.co' },
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: 'ik.imagekit.io' },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
  async rewrites() {
    return [];
  },
};

let withSentryConfig: ((config: NextConfig, options: Record<string, unknown>) => NextConfig) | null = null;

try {
  // Keep build working even when Sentry package is missing in some deploy contexts.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  withSentryConfig = require('@sentry/nextjs').withSentryConfig;
} catch {
  withSentryConfig = null;
}

const sentryOptions = {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  widenClientFileUpload: true,
  tunnelRoute: '/monitoring',
  silent: !process.env.CI,
};

export default withSentryConfig ? withSentryConfig(nextConfig, sentryOptions) : nextConfig;
