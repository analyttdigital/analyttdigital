import Link from 'next/link';

import { Band } from '@/components/layout/band';
import { InViewTitle } from '@/components/ui/in-view-title';
import { MediaSlot } from '@/components/media/dynamic-image';
import { GsapReveal, TiltCard } from '@/lib/motion/gsap-reveal';
import { MdiIcon } from '@/lib/icons/resolve-icon';
import { formatPostDate, postHref } from '@/lib/content/blog';
import { useChrome, useLocale } from '@/lib/content/chrome';
import type { InsightsSection } from '@/lib/content/types';

/**
 * Insights — the latest posts as soft tilt plates.
 *
 * Rounded plates on the paper band: media mount, numeral and category in
 * mono, display title, summary. Each plate leans into the pointer with an
 * ember spotlight (TiltCard) and rises + de-blurs into view (GSAP). Real
 * posts (`posts`, injected at render time) win over the static `articles`
 * fallback, which only renders when no posts arrive. Content shape unchanged.
 */

export function Insights({ insights }: { insights?: InsightsSection }) {
  const posts = insights?.posts ?? [];
  const articles = insights?.articles ?? [];
  const chrome = useChrome();
  const locale = useLocale();

  return (
    <Band id="insights" ground="paper">
      <GsapReveal>
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div data-rise>
            <p className="label text-ink-500">{insights?.eyebrow}</p>
            <InViewTitle
              text={(insights?.headline ?? '').replace(/\n/g, ' ')}
              variant="blur"
              as="h2"
              className="title mt-6 max-w-[16ch] text-[clamp(2rem,4vw,2.6rem)] text-ink-950"
            />
          </div>
          {posts.length ? null : (
          <span data-rise="1" className="inline-flex items-center gap-2 rounded-full border border-accent-600/40 bg-accent-500/[0.07] px-3.5 py-1.5 font-mono text-[9.5px] font-medium capitalize  text-accent-600">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent-500" />
            {chrome.inPreparation}
          </span>
          )}
        </div>

        {posts.length ? (
          <ol className="mt-12 grid gap-6 md:grid-cols-3">
            {posts.map((post, i) => (
              <li key={post.slug} data-rise={i + 1} className="h-full">
                <TiltCard
                  className="h-full rounded-3xl bg-paper-50 shadow-[0_22px_50px_-24px_rgb(var(--color-primary-600)/0.28)]"
                  max={5}
                >
                  <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-ink-950/[0.07]">
                    <MediaSlot
                      image={post.featuredImage}
                      icon="document"
                      label={chrome.mediaSlot}
                      tone="paper"
                      className="aspect-[16/10] w-full overflow-hidden"
                    />
                    <div className="flex flex-1 flex-col p-6">
                      <p className="flex items-center justify-between gap-3 font-mono text-[9.5px] capitalize  text-ink-400">
                        <span>{String(i + 1).padStart(2, '0')} /{post.category ? ` ${post.category}` : ''}</span>
                        {post.publishedAt ? <span>{formatPostDate(post.publishedAt, locale)}</span> : null}
                      </p>
                      <h3 className="verb mt-4 max-w-[24ch] text-[clamp(1.2rem,1.9vw,1.5rem)] text-ink-950 transition-colors duration-300 group-hover:text-accent-600">
                        <Link href={postHref(locale, post.slug)} className="before:absolute before:inset-0">
                          {post.title}
                        </Link>
                      </h3>
                      <p className="mt-3 max-w-[52ch] text-[12.5px] leading-[1.8] text-ink-500">
                        {post.excerpt}
                      </p>
                      <p className="mt-auto flex items-center gap-3 pt-6 text-ink-400 transition-colors duration-300 group-hover:text-accent-600">
                        <span className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5">
                          <MdiIcon name="arrowTopRight" size={0.75} />
                        </span>
                      </p>
                    </div>
                  </article>
                </TiltCard>
              </li>
            ))}
          </ol>
        ) : (
        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          {articles.map((article, i) => (
            <li key={article.title} data-rise={i + 1} className="h-full">
              <TiltCard
                className="h-full rounded-3xl bg-paper-50 shadow-[0_22px_50px_-24px_rgb(var(--color-primary-600)/0.28)]"
                max={5}
              >
                <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-ink-950/[0.07]">
                  <MediaSlot
                    icon="document"
                    label={chrome.mediaSlot}
                    tone="paper"
                    className="aspect-[16/10] w-full overflow-hidden"
                  />
                  <div className="flex flex-1 flex-col p-6">
                    <p className="flex items-center justify-between font-mono text-[9.5px] capitalize  text-ink-400">
                      <span>{article.index} /</span>
                      <span>{chrome.inPreparation}</span>
                    </p>
                    <h3 className="verb mt-4 max-w-[24ch] text-[clamp(1.2rem,1.9vw,1.5rem)] text-ink-950 transition-colors duration-300 group-hover:text-accent-600">
                      {article.title}
                    </h3>
                    <p className="mt-3 max-w-[52ch] text-[12.5px] leading-[1.8] text-ink-500">
                      {article.description}
                    </p>
                    <p className="mt-auto flex items-center gap-3 pt-6 font-mono text-[9.5px] capitalize  text-ink-400 transition-colors duration-300 group-hover:text-accent-600">
                      Read the note
                      <span className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5">
                        <MdiIcon name="arrowTopRight" size={0.75} />
                      </span>
                    </p>
                  </div>
                </article>
              </TiltCard>
            </li>
          ))}
        </ol>
        )}
      </GsapReveal>
    </Band>
  );
}
