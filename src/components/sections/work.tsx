import { Band } from '@/components/layout/band';
import { InViewTitle } from '@/components/graphics/in-view-title';
import { MediaSlot } from '@/components/media/dynamic-image';
import { CountUp } from '@/lib/motion/counter';
import { NodeIn } from '@/lib/motion/reveal';
import { MdiIcon } from '@/lib/icons/resolve-icon';
import { useChrome } from '@/lib/content/chrome';
import type { WorkSection } from '@/lib/content/types';

/**
 * Work — selected cases as a ruled evidence ledger, Otto feature-list style.
 *
 * Section head (statement left, mono eyebrow right), then one hairline-ruled
 * row per case: media mount, lot number + industry, client and claim, and
 * the recovering figure on the right in ember. The whole row is the hover
 * surface — the ground steps one tone, the row settles right, the media
 * breathes and the arrow arrives — the catalogue is read by touching it.
 * Field ground, paper type. Content shape unchanged.
 */
export function Work({ work }: { work?: WorkSection }) {
  const cases = work?.cases ?? [];
  const chrome = useChrome();

  return (
    <Band id="work" ground="field">
      <div className="flex items-start justify-between gap-8">
        <InViewTitle
          text={(work?.headline ?? '').replace(/\n/g, ' ')}
          variant="blur"
          as="h2"
          className="title max-w-[16ch] text-[clamp(2rem,4vw,2.6rem)] text-paper"
        />
        <p className="label hidden max-w-[220px] pt-2 text-right text-paper/60 sm:block">
          {work?.eyebrow ?? 'Selected work'}
        </p>
      </div>
      <p className="mt-6 max-w-[46ch] text-sm leading-relaxed text-paper/60">{chrome.workNote}</p>

      <ol className="mt-12 border-t border-paper-50/15">
        {cases.map((kase, i) => (
          <NodeIn as="li" key={kase.client} delay={0.05 + i * 0.05}>
            <article
              aria-label={`${kase.depth ?? kase.client} — ${kase.headline}`}
              className="group -mx-4 grid gap-x-8 gap-y-6 border-b border-paper-50/15 px-4 py-8 transition-all duration-300 hover:bg-primary-800 hover:pl-6 md:grid-cols-[11rem_minmax(0,1fr)_auto] lg:grid-cols-[14rem_minmax(0,1fr)_auto]"
            >
              <MediaSlot
                image={kase.image}
                icon="chartBox"
                label={kase.client}
                className="aspect-[4/3] w-full overflow-hidden transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              />
              <div>
                <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span className="font-mono text-[10.5px] tracking-[0.14em] text-paper/40">
                    {String(i + 1).padStart(2, '0')} /
                  </span>
                  <span className="font-mono text-[10.5px] font-medium uppercase tracking-[0.16em] text-accent-400">
                    {kase.depth ?? kase.client}
                  </span>
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-paper/40">
                    {kase.industry}
                  </span>
                </p>
                <h3 className="verb mt-3 max-w-[30ch] text-[clamp(1.3rem,2.2vw,1.8rem)] text-paper">
                  {kase.headline}
                </h3>
                <p className="mt-1 text-[12px] font-medium text-paper/50">{kase.client}</p>
                <p className="mt-3 max-w-[56ch] text-[13px] leading-[1.75] text-paper/60">{kase.body}</p>
              </div>
              <div className="flex items-start gap-6 md:flex-col md:items-end md:justify-between md:self-stretch md:py-1">
                <div className="md:text-right">
                  <CountUp
                    value={kase.metric}
                    className="num block text-[clamp(2rem,3.6vw,2.9rem)] leading-none text-accent-400"
                  />
                  <span className="mt-2 block max-w-[22ch] font-mono text-[9.5px] uppercase leading-relaxed tracking-[0.14em] text-paper/40">
                    {kase.metricLabel}
                  </span>
                </div>
                <span className="ml-auto pt-1 text-paper/40 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent-400 group-hover:opacity-100 md:ml-0">
                  <MdiIcon name="arrowTopRight" size={1} />
                </span>
              </div>
            </article>
          </NodeIn>
        ))}
      </ol>
    </Band>
  );
}
