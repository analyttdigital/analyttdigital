import { InViewTitle } from '@/components/ui/in-view-title';
import { GsapReveal } from '@/lib/motion/gsap-reveal';
import type { DataProps, ProblemSection } from '@/lib/content/types';

/**
 * ProblemAlt — the spend interrogated as a static figure.
 *
 * Where `Problem` pairs the charge with an interactive ledger (hover a row
 * or bar segment and its share splashes across the panel), the alt keeps the
 * same charge, paragraphs and closing but renders the evidence statically:
 * one thin stacked bar with labelled shares and definition rows beneath —
 * no hover state, no client state, so this stays a server component.
 * Content shape untouched.
 */

const DOT = ['bg-primary-400', 'bg-accent-500', 'bg-ink-950/10'];

/** Share of a chip value against the row total (same math as the ledger). */
function shareOf(value: string | undefined, total: number, fallback: number) {
  const parsed = Number.parseFloat((value ?? '').replace(/[^\d.]/g, ''));
  if (Number.isNaN(parsed) || total <= 0) return fallback;
  return (parsed / total) * 100;
}

export function ProblemAlt({ data, classes, className, id }: DataProps<ProblemSection, 'figure'>) {
  const chips = data?.panelChips ?? [];
  const total = chips.reduce((sum, chip) => {
    const parsed = Number.parseFloat(chip.value.replace(/[^\d.]/g, ''));
    return sum + (Number.isNaN(parsed) ? 0 : parsed);
  }, 0);

  return (
    <section id={id ?? 'problem'} className={`relative overflow-hidden bg-paper py-20 md:py-28 ${className ?? ''}`}>
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_45%_at_70%_30%,rgb(var(--color-accent-500)/0.08),transparent_70%)]" />

      <div className="relative mx-auto w-full max-w-7xl px-5 md:px-8">
        <GsapReveal>
          <div data-rise>
            <p className="label text-ink-500">{data?.eyebrow}</p>
            <InViewTitle
              text={(data?.headline ?? '').replace(/\n/g, ' ')}
              variant="blur"
              as="h2"
              className="title mt-7 max-w-[16ch] text-[clamp(2.2rem,4.6vw,2.4rem)] text-ink-950"
            />
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2 md:gap-10">
            {data?.paragraphs?.map((paragraph, i) => (
              <p key={i} data-rise={i + 1} className="max-w-[56ch] text-sm leading-[1.85] text-ink-500">
                {paragraph}
              </p>
            ))}
          </div>
          {data?.closing ? (
            <p data-rise="3" className="label mt-8 text-accent-400">{data.closing}</p>
          ) : null}

          {chips.length > 0 ? (
            <div
              data-rise="2"
              className={[
                'relative mt-14 overflow-hidden rounded-[2rem] bg-paper-50 p-7 shadow-[0_30px_80px_-36px_rgb(var(--color-primary-600)/0.3)] ring-1 ring-ink-950/10 md:p-10',
                classes?.figure,
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <div className="relative flex items-start justify-between gap-6">
                <p className="font-mono text-[10px] capitalize text-ink-500">
                  {data?.panelTitle ?? 'Account snapshot'}
                </p>
              </div>

              <p className="num relative mt-5 text-[clamp(2.6rem,5.4vw,1.2rem)] font-mono leading-none text-accent-600">
                {data?.panelAlert ?? 'Wasting −38%'}
              </p>

              <div className="relative mt-8 flex h-3 w-full gap-1" aria-hidden>
                {chips.map((chip, i) => (
                  <span
                    key={`${chip.label}-${i}`}
                    style={{ width: `${shareOf(chip.value, total, 100 / Math.max(chips.length, 1))}%` }}
                    className={`h-full min-w-2 rounded-full ${DOT[i % DOT.length]}`}
                  />
                ))}
              </div>

              <dl className="relative mt-6 divide-y divide-ink-950/10">
                {chips.map((chip, i) => (
                  <div key={`${chip.label}-${i}`} className="grid grid-cols-[0.9rem_minmax(0,1fr)_auto_auto] items-center gap-x-4 px-3 py-4">
                    <span aria-hidden className={`h-2.5 w-2.5 rounded-full ${DOT[i % DOT.length]}`} />
                    <dt className="text-sm font-medium tracking-tight text-ink-950">
                      {chip.label}
                    </dt>
                    <dd className="font-display text-base font-medium tracking-tight text-ink-950">
                      {chip.value}
                    </dd>
                    <dd className="w-10 text-right font-mono text-[10px] text-ink-400">
                      {Math.round(shareOf(chip.value, total, 100 / Math.max(chips.length, 1)))}%
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}
        </GsapReveal>
      </div>
    </section>
  );
}
