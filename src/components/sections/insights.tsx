import { MdiIcon } from '@/components/motion/mdi-icon';
import { SectionHeader } from '@/components/motion/section-header';
import { Cover3D } from '@/lib/motion/scroll-3d';
import type { InsightsSection } from '@/lib/content/types';

/** Insights — flat bordered article index with square arrow buttons. */
export function Insights({ insights }: { insights?: InsightsSection }) {
  const articles = insights?.articles ?? [];

  return (
    <section id="insights" data-scene="insights" data-snap className="relative border-t hairline bg-mist py-28 md:py-36">
      <div className="mx-auto max-w-[1320px] px-6 md:px-10">
        <SectionHeader eyebrow={insights?.eyebrow ?? ''} title={insights?.headline} />

        <div className="mt-16 grid gap-px border hairline bg-line md:grid-cols-3">
          {articles.map((article, i) => (
            <Cover3D key={article.title} delay={i * 0.06} tilt={10} y={40} className="bg-mist">
              <a
                href={article.href}
                className="group flex h-full flex-col bg-mist p-8 transition-colors duration-300 hover:bg-paper"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[12px] text-ink/35 transition-colors group-hover:text-ember">{article.index}.</span>
                  <span className="flex h-9 w-9 items-center justify-center border hairline text-ink/50 transition-all duration-300 group-hover:border-ember group-hover:bg-ember group-hover:text-white">
                    <MdiIcon name="arrowTopRight" size={0.75} />
                  </span>
                </div>
                <h3 className="mt-10 font-display text-[21px] font-semibold leading-snug text-ink-950">
                  {article.title}
                </h3>
                <p className="prose-serif mt-3 text-[14.5px]">{article.description}</p>
                <span className="mono-label mt-auto flex items-center gap-2 pt-6 text-ink/45 transition-colors group-hover:text-ember">
                  Read article <MdiIcon name="arrowRight" size={0.65} />
                </span>
              </a>
            </Cover3D>
          ))}
        </div>
      </div>
    </section>
  );
}
