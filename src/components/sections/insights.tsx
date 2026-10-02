import { MdiIcon } from '@/lib/icons/resolve-icon';
import { SectionHeader } from '@/components/motion/section-header';
import { Reveal } from '@/lib/motion/reveal';
import type { InsightsSection } from '@/lib/content/types';

/**
 * Insights — three floating white cards: index badge, title, description,
 * dashed divider, read row with circular arrow disc.
 */
export function Insights({ insights }: { insights?: InsightsSection }) {
  const articles = insights?.articles ?? [];

  return (
    <section
      id="insights"
      data-scene="insights"
      data-snap
      className="canvas relative flex min-h-[100svh] items-center overflow-hidden px-4 py-16 md:px-6"
    >
      <div className="stage relative mx-auto w-full max-w-[1320px] px-6 py-16 md:px-14 md:py-20">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <SectionHeader eyebrow={insights?.eyebrow ?? ''} title={insights?.headline} />
          <Reveal delay={0.15}>
            <span className="chip-pill">Field notes</span>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {articles.map((article, i) => (
            <Reveal key={article.title} delay={i * 0.1}>
              <a
                href={article.href}
                className="group flex h-full flex-col rounded-3xl border border-paper-400/60 bg-paper p-8 shadow-float transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-mist-100 font-display text-[13px] font-bold text-ink-800 transition-colors group-hover:bg-accent-100">
                    {article.index}
                  </span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink-950 text-paper transition-transform duration-300 group-hover:rotate-45">
                    <MdiIcon name="arrowTopRight" size={0.7} />
                  </span>
                </div>
                <h3 className="mt-7 font-display text-[21px] font-semibold leading-snug tracking-tight text-ink-950">
                  {article.title}
                </h3>
                <p className="mt-3 text-[14.5px] leading-relaxed text-ink-700">{article.description}</p>
                <div className="mt-auto pt-7">
                  <div className="flex items-center gap-2 border-t border-dashed border-ink-950/15 pt-5 text-[13px] font-semibold text-ink-600 transition-colors group-hover:text-accent-600">
                    Read article
                    <MdiIcon name="arrowRight" size={0.65} />
                  </div>
                </div>
              </a>
            </Reveal>
          ))}
        </div>

        <div aria-hidden className="blob blob--lavender -left-20 bottom-10 h-56 w-56 opacity-60" />
      </div>
    </section>
  );
}
