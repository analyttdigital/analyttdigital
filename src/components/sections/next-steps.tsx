import { InViewTitle } from '@/components/graphics/in-view-title';
import { GlowButton } from '@/components/graphics/glow-button';
import type { DataProps, ProcessSection } from '@/lib/content/types';
import { GsapReveal } from '@/lib/motion/gsap-reveal';

/**
 * NextSteps — what happens next as a vertical stepper.
 *
 * Built for the contact page's response sequence, which previously reused
 * the scroll-driven `process` instrument. Same `ProcessSection` shape, but
 * a static left rail instead of a stage: one node per step down a ruled
 * line (ember dot, mono numeral, title, desc, chips) with the closing ask
 * row beneath — the shape of things to come, not a system to explore. No
 * scroll progress, no client state: motion rides the shared `GsapReveal`,
 * so this stays a server component.
 */
export function NextSteps({
  data,
  classes,
  className,
  id,
}: DataProps<ProcessSection, 'head' | 'steps' | 'closing'>) {
  const steps = data?.steps ?? [];

  return (
    <section id={id} className={`relative overflow-hidden bg-paper py-16 md:py-24 ${className ?? ''}`}>
      <div
        className={['relative mx-auto w-full max-w-7xl px-5 md:px-8', classes?.head]
          .filter(Boolean)
          .join(' ')}
      >
        <GsapReveal>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-16">
            <div data-rise className="lg:sticky lg:top-24 lg:self-start">
              <p className="label text-ink-500">{data?.eyebrow}</p>
              <InViewTitle
                text={`${data?.headline ?? ''} ${data?.headlineAccent ?? ''}`.replace(/\n/g, ' ').trim()}
                variant="blur"
                as="h2"
                className="title mt-7 max-w-[16ch] text-[clamp(2rem,4vw,2.6rem)] text-ink-950"
              />
              {data?.lede ? (
                <p className="mt-6 max-w-[44ch] text-sm leading-[1.85] text-ink-500 md:text-base">
                  {data.lede}
                </p>
              ) : null}
            </div>

            {steps.length > 0 ? (
              <ol
                className={['relative border-l border-ink-950/10 pl-8', classes?.steps]
                  .filter(Boolean)
                  .join(' ')}
              >
                {steps.map((step, i) => (
                  <li key={step.n || i} data-rise={Math.min(i + 1, 3)} className="relative pb-10 last:pb-0">
                    <span aria-hidden className="absolute -left-8 top-1 grid h-[17px] w-[17px] -translate-x-1/2 place-items-center rounded-full bg-paper">
                      <span className="h-[9px] w-[9px] rounded-full bg-accent-500" />
                    </span>
                    <p className="num text-[13px] tracking-[0.14em] text-accent-600">
                      {step.n}
                    </p>
                    <h3 className="verb mt-2 text-[clamp(1.15rem,1.8vw,1.4rem)] text-ink-950">
                      {step.title}
                    </h3>
                    <p className="mt-2 max-w-[52ch] text-[13px] leading-[1.8] text-ink-500">{step.desc}</p>
                    {step.chips?.length ? (
                      <ul className="mt-4 flex flex-wrap gap-1.5">
                        {step.chips.map((chip) => (
                          <li
                            key={chip}
                            className="rounded-full border border-ink-950/15 px-3 py-0.5 text-[11px] text-ink-700"
                          >
                            {chip}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                ))}
              </ol>
            ) : null}
          </div>

          {data?.closing || data?.cta ? (
            <div
              data-rise
              className={['mt-12 flex flex-col justify-between gap-5 border-t border-ink-950/10 pt-8 md:flex-row md:items-center', classes?.closing]
                .filter(Boolean)
                .join(' ')}
            >
              {data?.closing ? (
                <p className="max-w-xl text-sm leading-relaxed text-ink-600">{data.closing}</p>
              ) : (
                <span />
              )}
              {data?.cta ? (
                <GlowButton
                  data={{ label: data.cta, href: data.ctaHref }}
                  className="w-full shrink-0 sm:w-auto"
                  tone="ember"
                />
              ) : null}
            </div>
          ) : null}
        </GsapReveal>
      </div>
    </section>
  );
}
