import { Band } from '@/components/layout/band';
import { InViewTitle } from '@/components/graphics/in-view-title';
import { MediaSlot } from '@/components/media/dynamic-image';
import { CountUp } from '@/lib/motion/counter';
import { GsapReveal, TiltCard } from '@/lib/motion/gsap-reveal';
import { MdiIcon } from '@/lib/icons/resolve-icon';
import { useChrome } from '@/lib/content/chrome';
import type { WorkSection } from '@/lib/content/types';

/**
 * Work — selected cases as soft evidence plates on the light band.
 *
 * Large rounded paper plates alternating media and copy, each leaning
 * gently into the pointer with an ember spotlight (TiltCard), the media
 * breathing on hover, entrances rising and de-blurring on scroll (GSAP).
 * The recovering figure stays ember and counts up. Content shape unchanged;
 * figures are the content's own numbers.
 */

const SHADOW = 'shadow-[0_30px_70px_-30px_rgb(var(--color-primary-600)/0.32)]';

export function Work({ work }: { work?: WorkSection }) {
  const cases = work?.cases ?? [];
  const chrome = useChrome();

  return (
    <Band id="work" ground="paper">
      <GsapReveal>
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div data-rise>
            <p className="label text-ink-500">{work?.eyebrow ?? 'Selected work'}</p>
            <InViewTitle
              text={(work?.headline ?? '').replace(/\n/g, ' ')}
              variant="blur"
              as="h2"
              className="title mt-6 max-w-[18ch] text-[clamp(2rem,4vw,2.6rem)] text-ink-950"
            />
          </div>
          <p data-rise="1" className="max-w-[38ch] text-sm leading-relaxed text-ink-500">
            {chrome.workNote}
          </p>
        </div>

        <ol className="mt-12 grid gap-8">
          {cases.map((kase, i) => {
            const flip = i % 2 === 1;
            return (
              <li key={kase.client} data-rise={Math.min(i + 1, 3)}>
                <TiltCard className={`rounded-[2rem] bg-paper-50 ${SHADOW}`} max={3.5}>
                  <article
                    aria-label={`${kase.depth ?? kase.client} — ${kase.headline}`}
                    className="group grid gap-x-10 gap-y-6 rounded-[2rem] border border-ink-950/[0.07] p-6 md:p-9 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center"
                  >
                    <MediaSlot
                      image={kase.image}
                      icon="chartBox"
                      label={kase.client}
                      tone="paper"
                      className={`aspect-[4/3] w-full overflow-hidden rounded-2xl transition-transform duration-500 ease-out group-hover:scale-[1.02] ${
                        flip ? 'lg:order-2' : ''
                      }`}
                    />
                    <div className={flip ? 'lg:order-1' : ''}>
                      <p className="flex flex-wrap items-center gap-x-4 gap-y-2">
                        <span className="inline-flex items-center gap-2 rounded-full bg-accent-500 px-3.5 py-1.5 font-mono text-[9.5px] font-medium uppercase tracking-[0.14em] text-paper-50">
                          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-paper-50" />
                          {kase.depth ?? kase.client}
                        </span>
                        <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-400">
                          {kase.industry}
                        </span>
                      </p>
                      <h3 className="verb mt-4 max-w-[26ch] text-[clamp(1.5rem,2.6vw,2.1rem)] text-ink-950">
                        {kase.headline}
                      </h3>
                      <p className="mt-1.5 text-[12px] font-medium text-ink-400">{kase.client}</p>
                      <p className="mt-4 max-w-[54ch] text-[13px] leading-[1.75] text-ink-500">{kase.body}</p>
                      <div className="mt-7 flex items-end justify-between gap-6 rounded-2xl bg-paper-200/60 px-5 py-4">
                        <div>
                          <CountUp
                            value={kase.metric}
                            className="num block text-[clamp(1.9rem,3.6vw,2.8rem)] leading-none text-accent-600"
                          />
                          <span className="mt-2 block max-w-[26ch] font-mono text-[9.5px] uppercase leading-relaxed tracking-[0.14em] text-ink-400">
                            {kase.metricLabel}
                          </span>
                        </div>
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-ink-950/15 text-ink-400 transition-all duration-300 group-hover:border-accent-600/50 group-hover:text-accent-600">
                          <MdiIcon name="arrowTopRight" size={0.85} />
                        </span>
                      </div>
                    </div>
                  </article>
                </TiltCard>
              </li>
            );
          })}
        </ol>
      </GsapReveal>
    </Band>
  );
}
