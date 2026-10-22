import { InViewTitle } from '@/components/ui/in-view-title';
import { GlowButton } from '@/components/ui/glow-button';
import type { DataProps, ProcessSection } from '@/lib/content/types';
import { GsapReveal } from '@/lib/motion/gsap-reveal';

/**
 * HowWeWork — the engagement as a horizontal timeline.
 *
 * Built for the about page's way-of-working block, which previously reused
 * the scroll-driven `process` instrument. Same `ProcessSection` shape, but
 * a static ruled rail instead of a stage: one node per step (ember dot,
 * mono numeral, title, desc, chips) with the closing ask row beneath. No
 * scroll progress, no client state: motion rides the shared `GsapReveal`,
 * so this stays a server component.
 */
export function HowWeWork({
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
          <div data-rise>
            <p className="label text-ink-500">{data?.eyebrow}</p>
            <InViewTitle
              text={`${data?.headline ?? ''} ${data?.headlineAccent ?? ''}`.replace(/\n/g, ' ').trim()}
              variant="blur"
              as="h2"
              className="title mt-7 max-w-[22ch] text-[clamp(2rem,4vw,2.6rem)] text-ink-950"
            />
            {data?.lede ? (
              <p className="mt-6 max-w-[62ch] text-sm leading-[1.85] text-ink-500 md:text-base">
                {data.lede}
              </p>
            ) : null}
          </div>

          {steps.length > 0 ? (
            <div
              className={['relative mt-14', classes?.steps]
                .filter(Boolean)
                .join(' ')}
            >
              <div aria-hidden className="absolute left-0 right-0 top-[5px] hidden h-px bg-ink-950/10 md:block" />
              <ol className="grid gap-10 md:grid-cols-5 md:gap-6">
                {steps.map((step, i) => (
                  <li key={step.n || i} data-rise={Math.min(i + 1, 3)} className="relative">
                    <span aria-hidden className="relative z-10 mb-5 hidden h-[11px] w-[11px] rounded-full bg-accent-500 ring-4 ring-paper md:block" />
                    <p className="num text-[13px] tracking-[0.14em] text-accent-600">
                      {step.n}
                    </p>
                    <h3 className="verb mt-2 text-[clamp(1.05rem,1.6vw,1.25rem)] text-ink-950">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-[12.5px] leading-[1.8] text-ink-500">{step.desc}</p>
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
            </div>
          ) : null}

          {data?.closing || data?.cta ? (
            <div
              data-rise
              className={['mt-12 flex flex-col justify-between gap-5 md:flex-row md:items-center', classes?.closing]
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
