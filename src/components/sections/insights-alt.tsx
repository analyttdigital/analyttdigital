import { InViewTitle } from '@/components/graphics/in-view-title';
import type { DataProps, InsightsSection } from '@/lib/content/types';
import { MdiIcon } from '@/lib/icons/resolve-icon';
import { GsapReveal } from '@/lib/motion/gsap-reveal';

/**
 * InsightsAlt — forthcoming entries as a ruled reading list.
 *
 * Where `Insights` leans tilt plates with media mounts into a grid, the alt
 * is a ledger of linked rows (mono position, title, summary, travel arrow)
 * on paper — no plates, no media, no client state. Content shape unchanged.
 */
export function InsightsAlt({ data, classes, className, id }: DataProps<InsightsSection, 'head' | 'rows'>) {
  const articles = data?.articles ?? [];

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

          {articles.length > 0 ? (
            <ol
              className={['mt-12 border-t border-ink-950/10', classes?.rows]
                .filter(Boolean)
                .join(' ')}
            >
              {articles.map((article, i) => (
                <li key={article.title || i} data-rise={Math.min(i + 1, 3)} className="border-b border-ink-950/10">
                  <a
                    href={article.href || '#'}
                    className="group grid gap-2 py-7 transition-colors duration-200 md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-baseline md:gap-8"
                  >
                    <span className="font-mono text-[10px] text-ink-300 transition-colors duration-200 group-hover:text-accent-500">
                      {article.index || String(i + 1).padStart(2, '0')}
                    </span>
                    <span>
                      <span className="verb block max-w-[30ch] text-[clamp(1.25rem,2.2vw,1.7rem)] leading-snug text-ink-950 transition-colors duration-200 group-hover:text-accent-600">
                        {article.title}
                      </span>
                      {article.description ? (
                        <span className="mt-2 block max-w-[58ch] text-[13px] leading-[1.8] text-ink-500">
                          {article.description}
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
