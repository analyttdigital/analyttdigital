import { Band, BandHead } from '@/components/layout/band';
import { InViewTitle } from '@/components/graphics/in-view-title';
import { MediaSlot } from '@/components/media/dynamic-image';
import { NodeIn, Reveal } from '@/lib/motion/reveal';
import { useChrome } from '@/lib/content/chrome';
import type { InsightsSection } from '@/lib/content/types';

/**
 * Insights — the notice board.
 *
 * Nothing here is published yet, and a link to nowhere is a lie the agency does
 * not need to tell. Three entries print as rows: plate, index, title, summary,
 * and an honest status stamp. When real articles exist the stamp is the only
 * thing that changes.
 *
 * The net runs across the three plates on one route, so the row reads as a
 * board with three entries rather than three separate cards.
 */
/** The two gutters between the three plates, where the row's routes run. */

export function Insights({ insights }: { insights?: InsightsSection }) {
  const articles = insights?.articles ?? [];
  const chrome = useChrome();

  return (
    <Band id="insights" ground="paper">
      <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
        <div>
          <BandHead>{insights?.eyebrow}</BandHead>
          <InViewTitle text={(insights?.headline ?? '').replace(/\n/g, " ")} lines={(insights?.headline ?? '').split('\n')} variant="line" as="h2" className="title text-[clamp(2.05rem,4.4vw,3.4rem)] mt-9" />
        </div>
        <Reveal delay={0.16}>
          <span className="chip chip--paper">{chrome.inPreparation}</span>
        </Reveal>
      </div>

      <ol className="mt-14 grid gap-5 md:grid-cols-3">
        {articles.map((article, i) => (
          <NodeIn as="li" key={article.title} delay={0.08 + i * 0.08}>
            <article className="panel--paper flex h-full flex-col p-6 transition-colors duration-300 hover:bg-paper-200">
              <MediaSlot
                icon="document"
                label={chrome.mediaSlot}
                className="aspect-[16/10] w-full"
              />
              <p className="num mt-6 text-[20px] text-ink-950/45">{article.index}</p>
              <h3 className="verb mt-3 text-[19px] text-ink-950">{article.title}</h3>
              <p className="body body--paper body--sm mt-3 flex-1">{article.description}</p>
              <p className="label label--plate mt-6">{chrome.inPreparation}</p>
            </article>
          </NodeIn>
        ))}
      </ol>
    </Band>
  );
}