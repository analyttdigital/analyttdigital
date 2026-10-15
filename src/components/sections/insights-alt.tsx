import { InViewTitle } from '@/components/graphics/in-view-title';
import { formatPostDate, postHref } from '@/lib/content/blog';
import { useLocale } from '@/lib/content/chrome';
import type { DataProps, InsightsSection } from '@/lib/content/types';
import { MdiIcon } from '@/lib/icons/resolve-icon';
import { GsapReveal } from '@/lib/motion/gsap-reveal';

/**
 * InsightsAlt — the latest posts as a ruled reading list.
 *
 * Where `Insights` leans tilt plates with media mounts into a grid, the alt
 * is a ledger of linked rows (mono position, title, summary, travel arrow)
 * on paper — no plates, no media, no client state. Real posts (`posts`,
 * injected at render time) win over the static `articles` fallback.
 * Content shape unchanged.
 */
export function InsightsAlt({ data, classes, className, id }: DataProps<InsightsSection, 'head' | 'rows'>) {
  const posts = data?.posts ?? [];
  const articles = data?.articles ?? [];
  const locale = useLocale();
  const rows = posts.length
    ? posts.map((post, i) => ({
        key: post.slug,
        index: String(i + 1).padStart(2, '0'),
        title: post.title,
        description: post.excerpt,
        href: postHref(locale, post.slug),
        meta: post.publishedAt ? formatPostDate(post.publishedAt, locale) : post.category,
      }))
    : articles.map((article, i) => ({
        key: `${article.title || 'article'}-${i}`,
        index: article.index || String(i + 1).padStart(2, '0'),
        title: article.title,
        description: article.description,
        href: article.href || '#',
        meta: null as string | null,
      }));

  return (
    <section id={id ?? 'insights'} className={`relative overflow-hidden bg-paper py-20 md:py-28 ${className ?? ''}`}>
      <div
        className={['relative mx-auto w-full max-w-7xl px-5 md:px-8', classes?.head]
          .filter(Boolean)
          .join(' ')}
      >
        <GsapReveal>
          <div data-rise>
            <p className="label text-ink-500">{data?.eyebrow}</p>
            <InViewTitle
              text={(data?.headline ?? '').replace(/\n/g, ' ')}
              variant="blur"
              as="h2"
              className="title mt-7 max-w-[16ch] text-[clamp(2rem,4vw,2.8rem)] text-ink-950"
            />
          </div>

          {rows.length > 0 ? (
            <ol
              className={['mt-12 border-t border-ink-950/10', classes?.rows]
                .filter(Boolean)
                .join(' ')}
            >
              {rows.map((row) => (
                <li key={row.key} data-rise={1} className="border-b border-ink-950/10">
                  <a
                    href={row.href}
                    className="group grid gap-2 py-7 transition-colors duration-200 md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-baseline md:gap-8"
                  >
                    <span className="font-mono text-[10px] text-ink-300 transition-colors duration-200 group-hover:text-accent-500">
                      {row.index}
                    </span>
                    <span>
                      <span className="verb block max-w-[30ch] text-[clamp(1.25rem,2.2vw,1.7rem)] leading-snug text-ink-950 transition-colors duration-200 group-hover:text-accent-600">
                        {row.title}
                      </span>
                      {row.description || row.meta ? (
                        <span className="mt-2 block max-w-[58ch] text-[13px] leading-[1.8] text-ink-500">
                          {row.description}
                          {row.description && row.meta ? ' — ' : null}
                          {row.meta}
                        </span>
                      ) : null}
                    </span>
                    <MdiIcon
                      name="arrowTopRight"
                      size={0.9}
                      className="hidden text-ink-300 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-500 md:block"
                    />
                  </a>
                </li>
              ))}
            </ol>
          ) : null}
        </GsapReveal>
      </div>
    </section>
  );
}
