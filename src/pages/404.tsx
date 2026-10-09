import { ErrorPage } from '@/components/layout/error-page';

/**
 * 404 — renders inside the site layout (`_app` falls back to code-default
 * chrome, since error routes carry no content bundle).
 */
export default function NotFoundPage() {
  return (
    <ErrorPage
      data={{
        title: 'Page not found — Analytt Digital',
        eyebrow: 'Error 404',
        headline: 'This page wandered off the path.',
        body: 'The route you followed doesn’t exist, or moved while you weren’t looking. Head back home — the argument is still where you left it.',
        primary: { label: 'Back to home', href: '/' },
        secondary: { label: 'Start with a free audit', href: '/#contact' },
      }}
    />
  );
}
