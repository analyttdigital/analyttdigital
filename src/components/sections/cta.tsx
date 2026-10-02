import { MdiIcon } from '@/lib/icons/resolve-icon';
import { Reveal } from '@/lib/motion/reveal';
import type { CtaSection } from '@/lib/content/types';

/**
 * CTA — screenshot 5 closing composition: centered headline with aurora
 * rings and floating input-row card, dark navy pill CTA, green free-bubble.
 */
export function Cta({ cta }: { cta?: CtaSection }) {
  return (
    <section
      id="audit"
      data-scene="audit"
      data-snap
      className="canvas relative flex min-h-[100svh] items-center overflow-hidden px-4 py-16 md:px-6"
    >
      <div className="stage relative mx-auto flex min-h-[calc(100svh-8rem)] w-full max-w-[1320px] flex-col items-center justify-center overflow-hidden px-6 py-20 text-center md:px-14">
        {/* aurora rings */}
        <div aria-hidden className="aurora pointer-events-none absolute left-1/2 top-1/2 h-[860px] w-[860px] -translate-x-1/2 -translate-y-1/2 opacity-60" />

        <Reveal>
          <div className="flex items-center justify-center gap-3">
            <p className="text-[15px] text-ink-700">{cta?.eyebrow}</p>
            {cta?.portalLabel ? (
              <span className="inline-flex items-center gap-1.5 rounded-pill bg-accent-500 px-3.5 py-1.5 text-[12px] font-bold text-white shadow-button-sm">
                {cta.portalLabel}
              </span>
            ) : null}
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <h2 className="display mt-5 max-w-3xl text-[clamp(2.6rem,5.6vw,4.4rem)] leading-[1.06] text-ink-950">
            {cta?.headline}
          </h2>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="mx-auto mt-6 max-w-xl text-[16px] leading-relaxed text-ink-700">{cta?.body}</p>
        </Reveal>

        <Reveal delay={0.24}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a href={cta?.ctaHref ?? 'mailto:hello@analyttdigital.com'} className="btn-pill btn-pill--ink">
              {cta?.cta} <MdiIcon name="arrowTopRight" size={0.65} />
            </a>
            <span className="callout">
              {cta?.note ?? 'No deck. No obligation.'}
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-100 text-[11px] font-bold text-accent-700">
                10
              </span>
            </span>
          </div>
        </Reveal>

        {/* floating method-row card — screenshot 5 bottom bar */}
        <Reveal delay={0.32}>
          <div className="card-float mt-14 hidden w-full max-w-2xl items-center gap-3 p-2.5 md:flex">
            <span className="flex-1 rounded-pill bg-mist-100 px-5 py-3 text-left text-[14px] font-medium text-ink-600">
              {cta?.note ?? 'No deck. No obligation. Just the findings.'}
            </span>
            <a
              href={cta?.ctaHref ?? 'mailto:hello@analyttdigital.com'}
              className="btn-disc btn-disc--accent"
              aria-label={cta?.cta ?? 'Request audit'}
            >
              <MdiIcon name="arrowTopRight" size={0.8} />
            </a>
          </div>
        </Reveal>

        <div aria-hidden className="blob blob--violet left-1/4 top-10 h-56 w-56 opacity-50" />
      </div>
    </section>
  );
}
