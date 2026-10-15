import { InViewTitle } from '@/components/graphics/in-view-title';
import { GlowButton } from '@/components/layout/glow-button';
import type { DataProps, ProcessSection } from '@/lib/content/types';
import { MdiIcon, processStepIcons } from '@/lib/icons/resolve-icon';
import { GsapReveal } from '@/lib/motion/gsap-reveal';

/**
 * ProcessAlt — the engagement as static step cards.
 *
 * Same `ProcessSection` content as the scroll-driven `ProcessChapter`, but
 * for step lists without figures (service pages compose steps copy-only):
 * a head (eyebrow, display headline + accent, lede), a responsive card grid
 * (mono numeral, title, desc, chips, one faint positional watermark glyph per
 * card — `processStepIcons`, same convention as the chapter stage), and the
 * closing ask row (closing line + ember `GlowButton`, mirroring
 * `ProcessClosing`). No scroll progress, no client state: motion rides the
 * shared `GsapReveal`, so this stays a server component.
 */
export function ProcessAlt({
  data,
  classes,
  className,
  id,
}: DataProps<ProcessSection, 'head' | 'grid' | 'card' | 'closing'>) {
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
            <ol
              className={['mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3', classes?.grid]
                .filter(Boolean)
                .join(' ')}
            >
              {steps.map((step, i) => (
                <li
                  key={step.n || i}
                  data-rise={Math.min(i + 1, 3)}
                  className={`relative overflow-hidden rounded-3xl border border-ink-950/[0.07] bg-paper-50 p-7 md:p-8 ${classes?.card ?? ''}`}
                >
                  {/* Positional watermark — one faint glyph per card. */}
                  <MdiIcon
                    name={processStepIcons[i % processStepIcons.length]}
                    size={7}
                    className="pointer-events-none absolute -bottom-5 -right-3 select-none text-ink-950/[0.06]"
                  />
                  <p className="num text-[clamp(1.8rem,3vw,2.4rem)] text-ink-300">{step.n}</p>
                  <h3 className="verb mt-3 text-[clamp(1.15rem,1.8vw,1.4rem)] text-ink-950">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-[13px] leading-[1.8] text-ink-500">{step.desc}</p>
                  {step.chips?.length ? (
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {step.chips.map((chip) => (
                        <li
                          key={chip}
                          className="rounded-full border border-ink-950/15 px-4 py-1 text-xs text-ink-700"
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
