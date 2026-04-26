import * as Sentry from '@sentry/nextjs';

// Always call init so global handlers register. Without a DSN the SDK stays inactive but configured.
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  sendDefaultPii: true,

  tracesSampleRate: process.env.NODE_ENV === 'development' ? 1.0 : 0.1,

  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  enableLogs: true,

  integrations: [Sentry.replayIntegration()],

  debug: process.env.NEXT_PUBLIC_SENTRY_DEBUG === '1',
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
