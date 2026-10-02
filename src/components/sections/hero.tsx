import { TraceRecorder } from '@/components/graphics/trace-recorder';
import { MdiIcon } from '@/lib/icons/resolve-icon';
import { Impression, MaskedLine, Reveal, RuleDraw } from '@/lib/motion/reveal';
import { useChrome } from '@/lib/content/chrome';
import type { HeroSection } from '@/lib/content/types';

/**
 * Hero — the masthead of the sheet.
 *
 * Left: the chart masthead, set at expanded-black over the type area with the
 * sub beneath a heavy rule and the primary action in the sheet's own
 * button. Right: the demonstration — a plate carrying a chart-recorder trace
 * that starts untriggered and locks standing still when tracking goes live,
 * over the account's two figures. The imposition strip closes the block with
 * the columns the sheet covers.
 *
 * Values on the plate are the product's own illustrative display figures, so
 * the plate says so in its caption rather than letting them read as proof.
 */
export function Hero({ hero }: { hero?: HeroSection }) {
  const chrome = useChrome();
  const lines = (hero?.headline ?? '').split('\n');
  const marquee = hero?.marquee ?? [];

  return (
    <section
      id="hero"
      data-sheet-block=""
      className="stock relative overflow-hidden px-4 pb-0 pt-28 md:px-6 md:pt-32"
    >
      {/* the surveyed ground reads through the masthead */}
      <div aria-hidden className="grain pointer-events-none absolute inset-0 opacity-[0.35] mix-blend-multiply" />

      <div className="relative mx-auto w-full max-w-[1320px]">
        {/* dateline — the sheet's own line, head set into the rule */}
        <div className="flex items-center gap-4">
          <span className="sheet-head">{hero?.eyebrow}</span>
          <span className="h-px flex-1 bg-ink-950/15" />
          <span className="folio">
            {chrome.sheet} 01 / 10
          </span>
        </div>

        <div className="mt-10 grid items-start gap-x-12 gap-y-14 lg:grid-cols-[minmax(0,1.06fr)_minmax(0,0.94fr)]">
          {/* ---- masthead ------------------------------------------- */}
          <div>
            <h1 className="masthead text-[clamp(2.7rem,7.2vw,6rem)] text-ink-950">
              {lines.map((line, i) => (
                <MaskedLine key={`${line}-${i}`} delay={0.12 + i * 0.1}>
                  {line || ' '}
                </MaskedLine>
              ))}
            </h1>

            <RuleDraw className="mt-10" delay={0.5}>
              <div className="h-0.5 w-full bg-ink-950/85" />
            </RuleDraw>

            <Reveal delay={0.55}>
              <p className="body-copy mt-8 max-w-[54ch]">{hero?.sub}</p>
            </Reveal>

            <Reveal delay={0.62}>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <a href={hero?.ctaHref ?? '#contact'} className="btn-sheet btn-sheet--spot">
                  {hero?.cta ?? 'Start with a free audit'} <MdiIcon name="arrowTopRight" size={0.6} />
                </a>
                <a href="#process" className="btn-sheet btn-sheet--quiet">
                  {hero?.scrollHint ?? 'Scroll'} <MdiIcon name="arrowDown" size={0.6} />
                </a>
              </div>
            </Reveal>
          </div>

          {/* ---- the demonstration ---------------------------------- */}
          <Impression delay={0.42} distance={7}>
            <figure className="plate rounded-[2px] p-2.5">
              <div className="flex items-center justify-between px-3.5 py-2.5">
                <p className="w-narrow text-[12px] font-bold uppercase tracking-[0.14em] text-ink-900">
                  {hero?.dashboardTitle ?? 'Campaign / Live'}
                </p>
                <p className="flex items-center gap-2">
                  <span aria-hidden className="inline-block h-1.5 w-1.5 bg-accent-500" />
                  <span className="figure text-[13px] text-accent-600">
                    {hero?.dashboardMetric ?? 'ROAS 4.2×'}
                  </span>
                </p>
              </div>

              {/* instrument: etched graticule + trace */}
              <div className="relative rounded-[2px] bg-mist-100 px-4 pb-2 pt-6">
                <svg
                  aria-hidden
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  className="absolute inset-x-4 top-6 h-[132px] w-[calc(100%-2rem)]"
                >
                  {[0, 25, 50, 75, 100].map((y) => (
                    <line
                      key={y}
                      x1="0"
                      x2="100"
                      y1={y}
                      y2={y}
                      stroke="rgb(var(--color-ink-950) / 0.12)"
                      strokeWidth="0.4"
                      vectorEffect="non-scaling-stroke"
                    />
                  ))}
                </svg>
                <div className="relative flex">
                  {/* measure ticks down the left edge, as on a recorder chart */}
                  <div
                    aria-hidden
                    className="mr-2 flex w-2 shrink-0 flex-col justify-between self-stretch py-px"
                  >
                    {[0, 1, 2, 3, 4].map((i) => (
                      <span key={i} className="h-px w-2 bg-ink-950/25" />
                    ))}
                  </div>
                  <TraceRecorder className="min-w-0 flex-1" height={132} />
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <p className="folio w-narrow">{chrome.signal}</p>
                  <p className="folio w-narrow text-accent-600">{chrome.trackingLive}</p>
                </div>
              </div>

              {/* the account's two figures, as a ledger */}
              <dl className="mt-2.5 grid grid-cols-2">
                <div className="border-r border-ink-950/10 px-3.5 py-3">
                  <dt className="folio w-narrow">{hero?.statA_label ?? 'CPL this month'}</dt>
                  <dd className="figure mt-1.5 text-[26px] text-ink-950">
                    {hero?.statA_value ?? 'KES 280'}
                    {hero?.statA_delta ? (
                      <span className="ml-2 align-super text-[11px] font-bold text-accent-600">
                        {hero.statA_delta}
                      </span>
                    ) : null}
                  </dd>
                </div>
                <div className="px-3.5 py-3">
                  <dt className="folio w-narrow">{hero?.statB_label ?? 'Leads / month'}</dt>
                  <dd className="figure mt-1.5 text-[26px] text-ink-950">
                    {hero?.statB_value ?? '1,200+'}
                  </dd>
                </div>
              </dl>

              <figcaption className="px-3.5 pb-1 pt-1 text-[11px] leading-snug text-ink-500">
                {chrome.illustration}
              </figcaption>
            </figure>
          </Impression>
        </div>

        {/* ---- imposition strip: what the sheet covers -------------- */}
        <div className="mt-16 border-y border-ink-950/12 py-4">
          <ul className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2">
            {marquee.map((item) => (
              <li key={item} className="flex items-center gap-7">
                <span className="w-narrow text-[11px] font-bold uppercase tracking-[0.16em] text-ink-600">
                  {item}
                </span>
                <span aria-hidden className="h-1.5 w-1.5 bg-ink-950/25" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
