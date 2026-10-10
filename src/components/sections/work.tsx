'use client';

import { DynamicImage } from '@/components/media/dynamic-image';
import { InViewTitle } from '@/components/graphics/in-view-title';
import { MdiIcon } from '@/lib/icons/resolve-icon';
import { CountUp } from '@/lib/motion/counter';
import { GsapReveal } from '@/lib/motion/gsap-reveal';
import type { DataProps, WorkCase, WorkSection } from '@/lib/content/types';

/**
 * Work — selected cases as an index panel on the dark stage.
 *
 * A near-black ground carrying an abstract flow-line backdrop, holding one
 * large paper panel: the intro (heading, paragraph, pill CTA) beside a
 * staggered three-column card index. Cards alternate a dark flowing-graphic
 * ground with the solid brand ground, positionally — the sequence is the
 * design, so no per-card styling lives in content. Each card keeps its
 * proof figure (the recovering number counts up); a case `image`, when
 * present, covers the card under a dark gradient via the shared media
 * resolver, otherwise the generated flow lines carry it.
 */

/** Dark flowing-graphic ground, except every third card which takes the
 *  solid brand ground — a positional default, content stays clean. */
const isDark = (i: number) => i % 3 !== 2;

/** Short cards ride lower, giving the index its stagger. */
const isLow = (i: number) => i % 2 === 1;

/** Flowing contour lines, drawn from token colours only. Decorative. */
function Waves({ stroke, className }: { stroke: string; className?: string }) {
  const paths = [
    { d: 'M-60,-20 C100,90 40,220 180,300 C300,370 260,480 340,600', o: 0.5 },
    { d: 'M60,-20 C200,100 140,230 280,310 C390,380 350,490 430,600', o: 0.32 },
    { d: 'M-20,-20 C120,110 80,240 210,320 C320,390 290,500 370,600', o: 0.22 },
    { d: 'M140,-20 C260,120 220,250 340,330 C440,400 410,510 490,600', o: 0.4 },
    { d: 'M200,-20 C300,110 270,240 380,320 C470,390 440,500 510,600', o: 0.18 },
  ];
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 400 560"
      preserveAspectRatio="xMidYMid slice"
      className={className}
    >
      {paths.map((p, i) => (
        <path
          key={i}
          d={p.d}
          fill="none"
          stroke={stroke}
          strokeOpacity={p.o}
          strokeWidth="1.25"
        />
      ))}
    </svg>
  );
}

function CaseCard({ kase, index }: { kase: WorkCase; index: number }) {
  const dark = isDark(index);
  const photo = kase.image?.src?.trim() ? kase.image : null;
  return (
    <article
      aria-label={`${kase.depth || kase.client} — ${kase.headline}`}
      className={[
        'group relative flex min-h-[340px] flex-col overflow-hidden rounded-3xl p-7',
        isLow(index) ? 'lg:mt-12 lg:min-h-[320px]' : 'lg:min-h-[400px]',
        !photo && dark ? 'bg-ink-950' : '',
        !photo && !dark ? 'bg-primary-600' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {photo ? (
        <>
          <DynamicImage image={photo} className="absolute inset-0 h-full w-full object-cover" sizes="480px" />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/70 to-ink-950/30" />
        </>
      ) : (
        <Waves
          stroke={dark ? 'rgb(var(--color-primary-300))' : 'rgb(255 255 255)'}
          className="absolute inset-0 h-full w-full"
        />
      )}

      <div className="relative flex items-start justify-between gap-3">
        <span className="font-mono text-xs tracking-[0.14em] text-paper-50/70">#{index + 1}</span>
        {kase.tag ? (
          <span className="rounded-full bg-paper-50/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-paper-50">
            {kase.tag}
          </span>
        ) : null}
      </div>

      <div className="relative mt-auto pt-10">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-primary-300">
          {kase.industry}
        </p>
        <h3 className="verb mt-2 text-[clamp(1.25rem,1.8vw,1.5rem)] leading-snug text-paper-50">
          {kase.client}
        </h3>
        <p className="mt-2 line-clamp-4 text-[13px] leading-relaxed text-paper-50/75">{kase.body}</p>
        <div className="mt-5 border-t border-paper-50/15 pt-4">
          <CountUp
            value={kase.metric}
            className="num block text-[clamp(1.5rem,2.4vw,2rem)] leading-none text-paper-50"
          />
          <span className="mt-1.5 block font-mono text-[9.5px] uppercase leading-relaxed tracking-[0.14em] text-paper-50/60">
            {kase.metricLabel}
          </span>
        </div>
      </div>
    </article>
  );
}

export function Work({ data, classes, className, id }: DataProps<WorkSection, 'panel' | 'intro' | 'grid' | 'card'>) {
  const cases = data?.cases ?? [];
  return (
    <section id={id ?? 'work'} className="relative overflow-hidden bg-ink-950 py-24 md:py-32">
      {/* Stage backdrop — abstract flow, never information. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -right-48 -top-32 h-[760px] w-[760px] opacity-60">
          <Waves stroke="rgb(var(--color-primary-400))" className="h-full w-full" />
        </div>
        <div className="absolute -bottom-56 -left-40 h-[640px] w-[640px] opacity-40">
          <Waves stroke="rgb(var(--color-primary-500))" className="h-full w-full" />
        </div>
        <div className="absolute left-1/2 top-1/3 h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-primary-600/20 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-5 md:px-8">
        <GsapReveal>
          <div
            className={[
              'rounded-[2rem] bg-paper px-6 py-12 shadow-[0_40px_120px_-40px_rgb(var(--color-primary-950)/0.55)] md:p-14',
              classes?.panel,
              className,
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <div className="grid gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-14">
              <div className={classes?.intro}>
                <div data-rise>
                  <InViewTitle
                    text={(data?.headline ?? '').replace(/\n/g, ' ')}
                    variant="blur"
                    as="h2"
                    className="title max-w-[16ch] text-[clamp(2rem,3.6vw,2.9rem)] text-ink-950"
                  />
                </div>
                {data?.body ? (
                  <p data-rise="1" className="mt-5 max-w-[38ch] text-sm leading-relaxed text-ink-500">
                    {data.body}
                  </p>
                ) : null}
                {data?.cta ? (
                  <p data-rise="2" className="mt-8">
                    <a
                      href={data.ctaHref || '#'}
                      className="inline-flex items-center gap-2.5 rounded-full bg-ink-950 px-6 py-3.5 text-sm font-medium text-paper-50 transition-colors duration-200 hover:bg-primary-700"
                    >
                      {data.cta}
                      <MdiIcon name="arrowRight" size={0.8} />
                    </a>
                  </p>
                ) : null}
              </div>

              <ol className={['grid gap-6 sm:grid-cols-2 xl:grid-cols-3', classes?.grid].filter(Boolean).join(' ')}>
                {cases.map((kase, i) => (
                  <li key={kase.client} data-rise={Math.min(i + 1, 3)} className={classes?.card}>
                    <CaseCard kase={kase} index={i} />
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </GsapReveal>
      </div>
    </section>
  );
}
