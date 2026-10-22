import Link from 'next/link';

import { Band } from '@/components/layout/band';
import { InViewTitle } from '@/components/ui/in-view-title';
import { BlogCard } from '@/components/sections/blog-card';
import { fillTemplate } from '@/lib/content/blog';
import type { BlogListing, DataProps, Locale } from '@/lib/content/types';
import { MdiIcon } from '@/lib/icons/resolve-icon';
import { GsapReveal } from '@/lib/motion/gsap-reveal';

/**
 * BlogList — the listing page. Head pattern from `page-hero` (eyebrow +
 * display headline, lede right), plates from `blog-card` in the insights grid
 * rhythm, server-rendered pagination beneath (plain links, no client state).
 * `basePath` is route-derived (`/blog`); everything editorial
 * rides in `data`.
 */
export function BlogList({
  data,
  basePath,
  locale,
  startIndex,
  classes,
  className,
  id,
}: DataProps<BlogListing, 'head' | 'grid' | 'pager'> & {
  basePath: string;
  locale: Locale;
  /** Global 0-based offset of the first card (route's `(page - 1) * size`). */
  startIndex: number;
}) {
  const pageHref = (n: number) => (n <= 1 ? basePath : `${basePath}/page/${n}`);

  return (
    <div id={id} className={className}>
      <section className="relative overflow-hidden bg-paper pb-10 pt-28 md:pb-12 md:pt-36">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_40%_at_50%_0%,rgb(var(--color-primary-200)/0.5),transparent_70%)]"
        />
        <div
          className={['relative mx-auto w-full max-w-7xl px-5 md:px-8', classes?.head]
            .filter(Boolean)
            .join(' ')}
        >
          <GsapReveal>
            <div className="flex flex-wrap items-end justify-between gap-8">
              <div data-rise>
                <p className="label text-ink-500">{data.eyebrow}</p>
                <InViewTitle
                  text={(data.headline ?? '').replace(/\n/g, ' ')}
                  variant="blur"
                  as="h1"
                  className="title mt-7 max-w-[18ch] text-[clamp(2.4rem,5.4vw,4rem)] text-ink-950"
                />
              </div>
              {data.body ? (
                <p
                  data-rise="1"
                  className="w-full max-w-[52ch] text-sm leading-[1.85] text-ink-500 md:text-base"
                >
                  {data.body}
                </p>
              ) : null}
            </div>
          </GsapReveal>
        </div>
      </section>

      <Band ground="paper">
        {data.posts.length === 0 ? (
          <p className="mx-auto max-w-[52ch] text-sm leading-[1.85] text-ink-500">{data.emptyNote}</p>
        ) : (
          <GsapReveal>
            <ol
              className={['grid gap-6 md:grid-cols-3', classes?.grid].filter(Boolean).join(' ')}
            >
              {data.posts.map((post, i) => (
                <li
                  key={post.slug}
                  data-rise={Math.min(i + 1, 3)}
                  className="relative h-full"
                >
                  <BlogCard
                    data={{
                      post,
                      index: String(startIndex + i + 1).padStart(2, '0'),
                      readMoreLabel: data.readMoreLabel,
                    }}
                    href={`${basePath}/${post.slug}`}
                    locale={locale}
                  />
                </li>
              ))}
            </ol>
          </GsapReveal>
        )}

        {data.totalPages > 1 ? (
          <nav
            aria-label={fillTemplate(data.pageOfTemplate, {
              n: String(data.page),
              total: String(data.totalPages),
            })}
            className={['mt-12 flex items-center justify-between gap-4', classes?.pager]
              .filter(Boolean)
              .join(' ')}
          >
            {data.page > 1 ? (
              <Link
                href={pageHref(data.page - 1)}
                className="inline-flex items-center gap-2.5 rounded-full border border-ink-950/15 px-6 py-3 text-sm font-medium text-ink-950 transition-colors duration-200 hover:border-ink-950/30"
              >
                <MdiIcon name="arrowLeft" size={0.8} />
                {data.prevLabel}
              </Link>
            ) : (
              <span />
            )}
            <p className="font-mono text-[10px] text-ink-400">
              {fillTemplate(data.pageOfTemplate, {
                n: String(data.page),
                total: String(data.totalPages),
              })}
            </p>
            {data.page < data.totalPages ? (
              <Link
                href={pageHref(data.page + 1)}
                className="inline-flex items-center gap-2.5 rounded-full bg-ink-950 px-6 py-3 text-sm font-medium text-paper-50 transition-colors duration-200 hover:bg-primary-700"
              >
                {data.nextLabel}
                <MdiIcon name="arrowRight" size={0.8} />
              </Link>
            ) : (
              <span />
            )}
          </nav>
        ) : null}
      </Band>
    </div>
  );
}
