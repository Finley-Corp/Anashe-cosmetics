'use client';

import * as Sentry from '@sentry/nextjs';
import { diagnoseSdkConnectivity } from '@sentry/browser';
import { useEffect, useState } from 'react';

class SentryExampleFrontendError extends Error {
  constructor(message?: string | undefined) {
    super(message);
    this.name = 'SentryExampleFrontendError';
  }
}

const issuesPageLink =
  process.env.NEXT_PUBLIC_SENTRY_ORG != null && process.env.NEXT_PUBLIC_SENTRY_ORG !== ''
    ? `https://${process.env.NEXT_PUBLIC_SENTRY_ORG}.sentry.io/issues/`
    : 'https://sentry.io/issues/';

/** Inlined at build time — if false, the browser SDK never sends events. */
const HAS_CLIENT_DSN = Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN);

export default function Page() {
  const [hasSentError, setHasSentError] = useState(false);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    Sentry.logger.info('Sentry example page loaded');
    async function checkConnectivity() {
      const result = await diagnoseSdkConnectivity();
      setIsConnected(result !== 'sentry-unreachable');
    }
    void checkConnectivity();
  }, []);

  return (
    <div>
      <main>
        <div className="sentry-example-flex-spacer" />
        <svg
          height="40"
          width="40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Sentry logo"
        >
          <path
            d="M21.85 2.995a3.698 3.698 0 0 1 1.353 1.354l16.303 28.278a3.703 3.703 0 0 1-1.354 5.053 3.694 3.694 0 0 1-1.848.496h-3.828a31.149 31.149 0 0 0 0-3.09h3.815a.61.61 0 0 0 .537-.917L20.523 5.893a.61.61 0 0 0-1.057 0l-3.739 6.494a28.948 28.948 0 0 1 9.63 10.453 28.988 28.988 0 0 1 3.499 13.78v1.542h-9.852v-1.544a19.106 19.106 0 0 0-2.182-8.85 19.08 19.08 0 0 0-6.032-6.829l-1.85 3.208a15.377 15.377 0 0 1 6.382 12.484v1.542H3.696A3.694 3.694 0 0 1 0 34.473c0-.648.17-1.286.494-1.849l2.33-4.074a8.562 8.562 0 0 1 2.689 1.536L3.158 34.17a.611.611 0 0 0 .538.917h8.448a12.481 12.481 0 0 0-6.037-9.09l-1.344-.772 4.908-8.545 1.344.77a22.16 22.16 0 0 1 7.705 7.444 22.193 22.193 0 0 1 3.316 10.193h3.699a25.892 25.892 0 0 0-3.811-12.033 25.856 25.856 0 0 0-9.046-8.796l-1.344-.772 5.269-9.136a3.698 3.698 0 0 1 3.2-1.849c.648 0 1.285.17 1.847.495Z"
            fill="currentcolor"
          />
        </svg>
        <h1>sentry-example-page</h1>

        {!HAS_CLIENT_DSN ? (
          <div className="sentry-example-warning" role="alert">
            <strong>Set your DSN.</strong> Add{' '}
            <code className="sentry-example-inline-code">NEXT_PUBLIC_SENTRY_DSN</code> from your Sentry
            project (Client Keys) to <code className="sentry-example-inline-code">.env.local</code>, then
            stop and restart <code className="sentry-example-inline-code">next dev</code> and reload this page.
            Optional: set <code className="sentry-example-inline-code">NEXT_PUBLIC_SENTRY_DEBUG=1</code> and
            watch the browser console for Sentry transport logs.
          </div>
        ) : null}

        <p className="sentry-example-description">
          Click the button below, and view the sample error on the Sentry{' '}
          <a target="_blank" rel="noopener noreferrer" href={issuesPageLink}>
            Issues Page
          </a>
          . For more details about setting up Sentry,{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://docs.sentry.io/platforms/javascript/guides/nextjs/"
          >
            read our docs
          </a>
          .
        </p>

        <button
          type="button"
          onClick={() => {
            void (async () => {
              Sentry.logger.info('User clicked the button, throwing a sample error');
              await Sentry.startSpan(
                {
                  name: 'Example Frontend/Backend Span',
                  op: 'test',
                },
                async () => {
                  const res = await fetch('/api/sentry-example-api');
                  if (!res.ok) {
                    setHasSentError(true);
                  }
                },
              );
              throw new SentryExampleFrontendError(
                'This error is raised on the frontend of the example page.',
              );
            })().catch((error: unknown) => {
              // Async onClick rejects are not handled by React; capture explicitly for Sentry.
              Sentry.captureException(error);
            });
          }}
          disabled={!isConnected || !HAS_CLIENT_DSN}
        >
          <span>Throw Sample Error</span>
        </button>

        <button
          type="button"
          className="sentry-example-secondary"
          onClick={() => {
            Sentry.captureMessage('Sentry smoke test (captureMessage)', 'info');
          }}
          disabled={!isConnected || !HAS_CLIENT_DSN}
        >
          <span>Send test message</span>
        </button>

        <p className="sentry-example-description sentry-example-mt">
          Docs also suggest calling a missing function to verify setup:
        </p>
        <pre className="sentry-example-code">myUndefinedFunction();</pre>
        <button
          type="button"
          className="sentry-example-secondary"
          onClick={() => {
            // @ts-expect-error Intentional ReferenceError — Sentry verification (see docs).
            myUndefinedFunction();
          }}
          disabled={!isConnected || !HAS_CLIENT_DSN}
        >
          <span>Trigger ReferenceError</span>
        </button>

        {hasSentError ? (
          <p className="sentry-example-success">Error sent to Sentry.</p>
        ) : !isConnected ? (
          <div className="sentry-example-connectivity-error">
            <p>
              It looks like network requests to Sentry are being blocked, which will prevent errors from
              being captured. Try disabling your ad-blocker to complete the test.
            </p>
          </div>
        ) : (
          <div className="sentry-example-success-placeholder" />
        )}

        <div className="sentry-example-flex-spacer" />
      </main>

      <style>{`
        main {
          display: flex;
          min-height: 100vh;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 16px;
          padding: 16px;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue",
            sans-serif;
        }

        h1 {
          padding: 0px 4px;
          border-radius: 4px;
          background-color: rgba(24, 20, 35, 0.03);
          font-family: monospace;
          font-size: 20px;
          line-height: 1.2;
        }

        .sentry-example-mt {
          margin-top: 8px;
        }

        .sentry-example-code {
          margin: 0;
          padding: 8px 12px;
          border-radius: 6px;
          background-color: rgba(24, 20, 35, 0.06);
          font-family: monospace;
          font-size: 14px;
        }

        p {
          margin: 0;
          font-size: 20px;
        }

        a {
          color: #6341f0;
          text-decoration: underline;
          cursor: pointer;
        }

        @media (prefers-color-scheme: dark) {
          a {
            color: #b3a1ff;
          }
        }

        button {
          border-radius: 8px;
          color: white;
          cursor: pointer;
          background-color: #553db8;
          border: none;
          padding: 0;
          margin-top: 4px;
        }

        button > span {
          display: inline-block;
          padding: 12px 16px;
          border-radius: inherit;
          font-size: 20px;
          font-weight: bold;
          line-height: 1;
          background-color: #7553ff;
          border: 1px solid #553db8;
          transform: translateY(-4px);
        }

        button:hover > span {
          transform: translateY(-8px);
        }

        button:active > span {
          transform: translateY(0);
        }

        button:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }

        button:disabled > span {
          transform: translateY(0);
          border: none;
        }

        button.sentry-example-secondary {
          background-color: #3d3558;
        }

        button.sentry-example-secondary > span {
          background-color: #5a4d82;
          border-color: #3d3558;
          font-size: 16px;
        }

        .sentry-example-description {
          text-align: center;
          color: #6e6c75;
          max-width: 500px;
          line-height: 1.5;
          font-size: 20px;
        }

        @media (prefers-color-scheme: dark) {
          .sentry-example-description {
            color: #a49fb5;
          }
        }

        .sentry-example-flex-spacer {
          flex: 1;
        }

        .sentry-example-success {
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 20px;
          line-height: 1;
          background-color: #00f261;
          border: 1px solid #00bf4d;
          color: #181423;
        }

        .sentry-example-success-placeholder {
          height: 46px;
        }

        .sentry-example-connectivity-error {
          padding: 12px 16px;
          background-color: #e50045;
          border-radius: 8px;
          width: 500px;
          max-width: 100%;
          color: #ffffff;
          border: 1px solid #a80033;
          text-align: center;
          margin: 0;
        }

        .sentry-example-connectivity-error a {
          color: #ffffff;
          text-decoration: underline;
        }

        .sentry-example-warning {
          max-width: 520px;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 15px;
          line-height: 1.45;
          text-align: left;
          background-color: #fff8e6;
          border: 1px solid #f0c040;
          color: #3d3520;
        }

        .sentry-example-inline-code {
          font-family: monospace;
          font-size: 13px;
          padding: 1px 6px;
          border-radius: 4px;
          background-color: rgba(0, 0, 0, 0.06);
        }
      `}</style>
    </div>
  );
}
