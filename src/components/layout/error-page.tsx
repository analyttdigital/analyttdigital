import Head from 'next/head';
import type { ReactNode } from 'react';

/**
 * ErrorPage — the shared shell for the 404/500 routes.
 *
 * Styled after the hero's light stage (paper ground, ember pill, display
 * headline, ink lede) so a dead end still reads as the same site. Copy
 * arrives as `data`; the 500 route passes its error dump as `children`.
 */

export type ErrorPageData = {
  /** Document title. */
  title: string;
  /** Pill above the headline, e.g. "Error 404". */
  eyebrow: string;
  headline: string;
  body: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
};

export function ErrorPage({
  data,
  children,
  className,
}: {
  data: ErrorPageData;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <>
      <Head>
        <title>{data.title}</title>
        <meta name="robots" content="noindex" />
      </Head>

      <section className={`relative bg-paper font-sans text-ink-800 ${className ?? ''}`}>
        <div
          aria-hidden
          className="absolute inset-0 bg-paper bg-[radial-gradient(55%_70%_at_70%_48%,rgba(240,79,38,.11),transparent_70%),radial-gradient(45%_55%_at_8%_100%,transparent_70%,transparent_70%)]"
        />
        <div className="relative mx-auto flex min-h-[max(100svh,640px)] w-full max-w-7xl flex-col justify-center px-5 py-36 sm:px-[clamp(20px,6vw,96px)]">
          <div className="w-full max-w-[760px]">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary-900/15 bg-paper/80 px-3 py-1.5 text-xs font-medium text-accent">
              {data.eyebrow}
            </span>

            <h1 className="font-display text-[clamp(2rem,5vw,3.4rem)] font-bold leading-[1.02] tracking-tightest text-primary-900">
              {data.headline}
            </h1>

            <p className="mt-[18px] max-w-[30em] leading-relaxed text-ink-500 sm:mt-6">
              {data.body}
            </p>

            <div className="mt-[26px] flex flex-wrap items-center gap-4 sm:mt-[34px] sm:gap-[22px]">
              <a
                href={data.primary.href}
                className="group/btn inline-flex items-center gap-3 rounded-full bg-accent px-7 py-4 text-[.95rem] font-semibold text-white shadow-[0_10px_30px_-10px_rgba(240,79,38,.6)] transition hover:bg-accent-600"
              >
                {data.primary.label}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform group-hover/btn:translate-x-1"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
              {data.secondary ? (
                <a
                  href={data.secondary.href}
                  className="inline-flex items-center gap-3 rounded-full border border-ink-950/20 px-7 py-4 text-[.95rem] font-semibold text-ink-800 transition hover:border-accent-500 hover:text-accent-600"
                >
                  {data.secondary.label}
                </a>
              ) : null}
            </div>

            {children}
          </div>
        </div>
      </section>
    </>
  );
}
