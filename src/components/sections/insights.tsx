import { SheetBlock, SheetTitle } from '@/components/layout/sheet-block';
import { Reveal } from '@/lib/motion/reveal';
import { useChrome } from '@/lib/content/chrome';
import type { InsightsSection } from '@/lib/content/types';

/**
 * Insights — the notice board.
 *
 * Nothing here is published yet, and a link to nowhere is a lie the agency
 * does not need to tell. The three entries print as a notice board: index,
 * title, summary, and an honest status stamp. When real articles exist the
 * stamp is the only thing that changes.
 */
export function Insights({ insights }: { insights?: InsightsSection }) {
  const articles = insights?.articles ?? [];
  const chrome = useChrome();

  return (
    <SheetBlock id="insights" folio="09" head={insights?.eyebrow} tone="a">
      <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
        <SheetTitle lines={insights?.headline ?? ''} delay={0.1} />
        <Reveal delay={0.18}>
          <p className="stamp">{chrome.inPreparation}</p>
        </Reveal>
      </div>

      <div aria-hidden className="mt-12 h-0.5 w-full bg-ink-950/85" />

      <ol>
        {articles.map((article, i) => (
          <Reveal key={article.title} delay={0.1 + i * 0.08}>
            <li className="group grid items-start gap-x-10 gap-y-3 border-b border-ink-950/15 py-9 transition-colors duration-300 hover:bg-paper/70 lg:grid-cols-[4rem_minmax(0,1fr)_minmax(0,0.72fr)]">
              <span className="figure text-[22px] text-ink-300 transition-colors duration-300 group-hover:text-accent-600">
                {article.index}
              </span>
              <div>
                <h3 className="sheet-verb text-[clamp(1.2rem,2.1vw,1.6rem)] text-ink-950">
                  {article.title}
                </h3>
                <p className="body-copy mt-3 max-w-[58ch] text-[14.5px]">{article.description}</p>
              </div>
              <p className="w-narrow text-[10.5px] font-bold uppercase tracking-[0.14em] text-ink-400 lg:justify-self-end">
                {chrome.inPreparation}
              </p>
            </li>
          </Reveal>
        ))}
      </ol>
    </SheetBlock>
  );
}
