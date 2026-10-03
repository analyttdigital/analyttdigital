import { Band, BandHead, BandTitle } from '@/components/layout/band';
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
const NODES = [
  { x: 0.0, y: 0.11 },
  { x: 0.2, y: 0.2 },
  { x: 0.95, y: 0.22 },
  { x: 0.33, y: 0.6 },
  { x: 0.66, y: 0.6 },
];

export function Insights({ insights }: { insights?: InsightsSection }) {
  const articles = insights?.articles ?? [];
  const chrome = useChrome();

  return (
    <Band id="insights" ground="deep" mesh={{ seed: 57, count: 5, depth: 38, opacity: 0.5, anchors: NODES }}>
      <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
        <div>
          <BandHead>{insights?.eyebrow}</BandHead>
          <BandTitle lines={insights?.headline ?? ''} className="mt-9" />
        </div>
        <Reveal delay={0.16}>
          <span className="chip chip--ember">{chrome.inPreparation}</span>
        </Reveal>
      </div>

      <ol className="mt-14 grid gap-5 md:grid-cols-3">
        {articles.map((article, i) => (
          <NodeIn as="li" key={article.title} delay={0.08 + i * 0.08}>
            <article className="panel--deep flex h-full flex-col p-6 transition-colors duration-300 hover:bg-surface-700">
              <MediaSlot
                icon="document"
                label={chrome.mediaSlot}
                className="aspect-[16/10] w-full"
              />
              <p className="num mt-6 text-[20px] text-primary-50/45">{article.index}</p>
              <h3 className="verb mt-3 text-[19px] text-primary-50">{article.title}</h3>
              <p className="body body--sm mt-3 flex-1 text-primary-200">{article.description}</p>
              <p className="label label--ember mt-6">{chrome.inPreparation}</p>
            </article>
          </NodeIn>
        ))}
      </ol>
    </Band>
  );
}