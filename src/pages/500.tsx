import { ErrorPage } from '@/components/layout/error-page';

/**
 * 500 — renders inside the site layout (`_app` falls back to code-default
 * chrome, since error routes carry no content bundle).
 *
 * Next passes the thrown error as the `err` prop. Its message renders always;
 * the full stack only outside production, so a live failure never leaks
 * internals to visitors.
 */

type ServerErrorProps = {
  err?: (Error & { digest?: string }) | null;
};

export default function ServerErrorPage({ err }: ServerErrorProps) {
  const detail =
    process.env.NODE_ENV === 'production' ? err?.message : (err?.stack ?? err?.message);

  return (
    <ErrorPage
      data={{
        title: 'Something went wrong — Analytt Digital',
        eyebrow: 'Error 500',
        headline: 'The signal dropped on our end.',
        body: 'Something failed while rendering this page. It’s been logged — head back home and try again, or send us the reference below and we’ll take it from there.',
        primary: { label: 'Back to home', href: '/' },
        secondary: { label: 'Contact us', href: '/#contact' },
      }}
    >
      {detail ? (
        <div className="mt-10 max-w-[56ch]">
          <p className="label text-ink-500">Error reference</p>
          <pre className="mt-3 max-h-64 overflow-auto whitespace-pre-wrap break-words rounded-xl border border-ink-950/10 bg-paper-50 p-4 font-mono text-xs leading-relaxed text-ink-700">
            {detail}
          </pre>
        </div>
      ) : null}
    </ErrorPage>
  );
}
