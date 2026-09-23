import { SectionHeader } from '@/components/motion/section-header';
import { Reveal } from '@/lib/motion/reveal';
import type { InsightsSection } from '@/lib/content/types';

/** "INSIGHTS" — numbered article rows with depth-float hover. */
export function Insights({ insights }: { insights?: InsightsSection }) {
  const articles = insights?.articles ?? [];

  return (
    <section id="insights" className="relative py-28 md:py-36">
      <div className="mx-auto max-w-[1320px] px-6 md:px-10">
        <SectionHeader eyebrow={insights?.eyebrow ?? ''} title={insights?.headline} />

        <div className="mt-16 border-t hairline">
          {articles.map((article, i) => (
            <Reveal key={article.title} delay={i * 0.05}>
              <a
                href={article.href}
                className="depth-float group grid gap-4 border-b hairline bg-transparent px-2 py-10 md:grid-cols-[80px_1fr_auto] md:items-center"
              >
                <span className="font-mono text-[13px] text-ink/40">{article.index}.</span>
                <div>
                  <h3 className="font-display text-[24px] font-semibold text-ink-950 transition-colors group-hover:text-ember">
                    {article.title}
                  </h3>
                  <p className="prose-serif mt-2 max-w-2xl text-[15px]">{article.description}</p>
                </div>
                <span className="mono-label text-ink/60 transition-colors group-hover:text-ember">
                  Read article <span aria-hidden>→</span>
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
