import { Band } from '@/components/layout/band';
import { InViewTitle } from '@/components/graphics/in-view-title';
import { MediaSlot } from '@/components/media/dynamic-image';
import { NodeIn } from '@/lib/motion/reveal';
import { MdiIcon } from '@/lib/icons/resolve-icon';
import { useChrome } from '@/lib/content/chrome';
import type { InsightsSection } from '@/lib/content/types';

/**
 * Insights — forthcoming entries as a ruled register, Otto feature-list
 * style.
 *
 * Section head with the statement on the left and the status as a bordered
 * mono tag on the right; then one hairline row per entry — lot numeral,
 * square media mount, title and summary, arrow at the margin. The row is
 * the hover surface: the ground lifts to the plate tone, the row settles
 * right, the arrow arrives. Nothing links anywhere until real articles
 * exist. Paper band, ink type. Content shape unchanged.
 */

export function Insights({ insights }: { insights?: InsightsSection }) {
  const articles = insights?.articles ?? [];
  const chrome = useChrome();

  return (
    <Band id="insights" ground="paper">
      <div className="flex items-start justify-between gap-8">
        <InViewTitle
          text={(insights?.headline ?? '').replace(/\n/g, ' ')}
          variant="blur"
          as="h2"
          className="title max-w-[14ch] text-[clamp(2rem,4vw,2.6rem)] text-ink-950"
        />
        <div className="flex flex-col items-end gap-4 pt-1">
          <p className="label text-ink-500">{insights?.eyebrow}</p>
          <span className="inline-flex items-center gap-2 rounded-full border border-accent-600/40 px-3.5 py-1.5 font-mono text-[9.5px] font-medium uppercase tracking-[0.14em] text-accent-600">
            <span aria-hidden className="h-1.5 w-1.5 bg-accent-500" />
            {chrome.inPreparation}
          </span>
        </div>
      </div>

      <ol className="mt-12 border-t border-ink-950/15">
        {articles.map((article, i) => (
          <NodeIn as="li" key={article.title} delay={0.06 + i * 0.07}>
            <article className="group -mx-4 grid gap-x-8 gap-y-5 border-b border-ink-950/15 px-4 py-7 transition-all duration-300 hover:bg-paper-50 hover:pl-6 md:grid-cols-[2.5rem_10rem_minmax(0,1fr)_1.5rem] md:items-start lg:grid-cols-[2.5rem_13rem_minmax(0,1fr)_1.5rem]">
              <span className="pt-1 font-mono text-[10.5px] tracking-[0.14em] text-ink-400">
                {article.index} /
              </span>
              <MediaSlot
                icon="document"
                label={chrome.mediaSlot}
                tone="paper"
                className="aspect-[4/3] w-full overflow-hidden transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              />
              <div>
                <h3 className="verb max-w-[34ch] text-[clamp(1.2rem,2vw,1.55rem)] text-ink-950 transition-colors duration-300 group-hover:text-accent-600">
                  {article.title}
                </h3>
                <p className="mt-2.5 max-w-[58ch] text-[12.5px] leading-[1.8] text-ink-500">
                  {article.description}
                </p>
                <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.14em] text-ink-400">
                  {chrome.inPreparation}
                </p>
              </div>
              <span className="hidden pt-1 text-ink-400 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent-600 group-hover:opacity-100 md:block">
                <MdiIcon name="arrowTopRight" size={0.95} />
              </span>
            </article>
          </NodeIn>
        ))}
      </ol>
    </Band>
  );
}
