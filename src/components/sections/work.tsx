'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { DynamicImage } from '@/components/media/dynamic-image';
import { InViewTitle } from '@/components/graphics/in-view-title';
import { MdiIcon } from '@/lib/icons/resolve-icon';
import { CountUp } from '@/lib/motion/counter';
import { useChrome } from '@/lib/content/chrome';
import { GsapReveal } from '@/lib/motion/gsap-reveal';
import type { DataProps, WorkCase, WorkSection } from '@/lib/content/types';

/**
 * Work — selected cases as a horizontal scroll strip on the light stage.
 *
 * A paper ground holding one light panel: the header (live eyebrow, display
 * title, intro paragraph, ink pill CTA) with the strip controls riding below,
 * then a snap-scrolling row of case cards — one per view on mobile, a ~400px
 * filmstrip beyond. Cards keep the top-image treatment (a cropped photo via
 * the shared media resolver, otherwise generated flow lines) above the copy
 * and the proof figure (the recovering number counts up in ember); the tint
 * alternates positionally, so no per-card styling lives in content. A thin
 * ember meter reports strip progress, prev/next keys nudge by exactly one
 * card, and the mono counter names the card in view.
 */

/** Light lavender tint, except every third card which stays white — a
 *  positional default, content stays clean. */
const isTint = (i: number) => i % 3 !== 2;

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

function CaseCard({ kase, index, total }: { kase: WorkCase; index: number; total: number }) {
  const tint = isTint(index);
  const photo = kase.image?.src?.trim() ? kase.image : null;
  return (
    <article
      aria-label={`${kase.depth || kase.client} — ${kase.headline}`}
      className={[
        'group relative flex h-full min-h-[420px] flex-col overflow-hidden rounded-3xl',
        tint ? 'bg-primary-100' : 'bg-paper-50 shadow-[0_24px_60px_-30px_rgb(var(--color-primary-600)/0.35)] ring-1 ring-ink-950/[0.08]',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Media on top — photo first, generated flow lines as the fallback. */}
      <div className="relative h-48 w-full shrink-0 overflow-hidden">
        {photo ? (
          <DynamicImage image={photo} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" sizes="480px" />
        ) : (
          <Waves
            stroke={tint ? 'rgb(var(--color-primary-500))' : 'rgb(var(--color-primary-300))'}
            className="absolute inset-0 h-full w-full"
          />
        )}
        <span className="absolute left-5 top-5 rounded-full bg-ink-950/55 px-2.5 py-1 font-mono text-xs  text-paper-50 backdrop-blur-sm">{String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
        {kase.tag ? (
          <span className="absolute right-5 top-5 rounded-full bg-paper-50/90 px-2.5 py-1 font-mono text-[10px] capitalize  text-accent-700 backdrop-blur-sm">
            {kase.tag}
          </span>
        ) : null}
      </div>

      <div className="relative flex flex-1 flex-col p-7 pt-6">
        <p className="font-mono text-[10.5px] capitalize  text-primary-600">
          {kase.industry}
        </p>
        <h3 className="verb mt-2 text-[clamp(1.25rem,1.8vw,1.5rem)] leading-snug text-ink-950">
          {kase.client}
        </h3>
        <p className="mt-2 line-clamp-4 text-[13px] leading-relaxed text-ink-500">{kase.body}</p>
        <div className="mt-auto pt-5">
          <div className="border-t border-ink-950/10 pt-4">
            <CountUp
              value={kase.metric}
              className="num block text-[clamp(1.5rem,2.4vw,2rem)] leading-none text-accent-600"
            />
            <span className="mt-1.5 block font-mono text-[9.5px] capitalize leading-relaxed  text-ink-500">
              {kase.metricLabel}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

export function Work({ data, classes, className, id }: DataProps<WorkSection, 'panel' | 'intro' | 'grid' | 'card'>) {
  const cases = data?.cases ?? [];
  const chrome = useChrome();
  const stripRef = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  // The strip reports its own scroll: active card from the nearest snap
  // stop, edge flags for the nudge keys, progress for the ember meter. One
  // rAF-throttled listener on the strip itself — no page scroll hooks.
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip || cases.length < 2) {
      setActive(0);
      setAtStart(true);
      setAtEnd(true);
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = strip.scrollWidth - strip.clientWidth;
      const x = Math.min(Math.max(strip.scrollLeft, 0), Math.max(max, 0));
      setAtStart(x <= 4);
      setAtEnd(max <= 4 || x >= max - 4);
      const cards = Array.from(strip.querySelectorAll<HTMLElement>('[data-card]'));
      if (!cards.length) return;
      const mid = x + strip.clientWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      cards.forEach((card, i) => {
        const dist = Math.abs(card.offsetLeft - strip.offsetLeft + card.clientWidth / 2 - mid);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      setActive(best);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    strip.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      strip.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [cases.length]);

  // Nudge keys move by exactly one card (card width + the strip gap), so a
  // press always lands on a snap stop instead of mid-card.
  const nudge = useCallback((dir: 1 | -1) => {
    const strip = stripRef.current;
    if (!strip) return;
    const card = strip.querySelector<HTMLElement>('[data-card]');
    const step = card ? card.clientWidth + 24 : Math.max(strip.clientWidth * 0.8, 280);
    strip.scrollBy({ left: dir * step, behavior: 'smooth' });
  }, []);

  const total = cases.length;
  const progress = total > 1 ? (active + 1) / total : 1;
  return (
    <section id={id ?? 'work'} className="relative overflow-hidden py-24 md:py-32">
      {/* Stage backdrop — faint flow, never information. */}
      {/* <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -right-48 -top-32 h-[760px] w-[760px] opacity-70">
          <Waves stroke="rgb(var(--color-primary-300))" className="h-full w-full" />
        </div>
        <div className="absolute -bottom-56 -left-40 h-[640px] w-[640px] opacity-50">
          <Waves stroke="rgb(var(--color-primary-400))" className="h-full w-full" />
        </div>
        <div className="absolute left-1/2 top-1/3 h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-primary-200/50 blur-3xl" />
      </div> */}

      <div className="relative mx-auto w-full max-w-7xl px-5 md:px-8">
        <GsapReveal>
          <div
            className={[
              'md:p-14',
              classes?.panel,
              className,
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <div className="flex flex-wrap items-end justify-between gap-8">
              <div className={classes?.intro}>
                <div data-rise>
                  <p className="font-mono text-[10.5px] capitalize  text-primary-600">
                    {data?.eyebrow ?? ''}
                  </p>
                  <InViewTitle
                    text={(data?.headline ?? '').replace(/\n/g, ' ')}
                    variant="blur"
                    as="h2"
                    className="title mt-4 max-w-[16ch] text-[clamp(2rem,3.6vw,2.9rem)] text-ink-950"
                  />
                </div>
                {data?.body ? (
                  <p data-rise="1" className="mt-5 max-w-[52ch] text-sm leading-relaxed text-ink-500">
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

              {total > 1 ? (
                <div data-rise="2" className="flex items-center gap-3">
                  <span className="font-mono text-[10.5px]  text-ink-500" aria-live="polite">
                    {String(active + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                  </span>
                  <button
                    type="button"
                    onClick={() => nudge(-1)}
                    disabled={atStart}
                    aria-label={chrome.workPrev}
                    className="grid h-11 w-11 place-items-center rounded-full bg-ink-950 text-paper-50 transition-all duration-200 hover:bg-primary-700 disabled:cursor-default disabled:opacity-25 disabled:hover:bg-ink-950"
                  >
                    <MdiIcon name="arrowLeft" size={0.85} />
                  </button>
                  <button
                    type="button"
                    onClick={() => nudge(1)}
                    disabled={atEnd}
                    aria-label={chrome.workNext}
                    className="grid h-11 w-11 place-items-center rounded-full bg-ink-950 text-paper-50 transition-all duration-200 hover:bg-primary-700 disabled:cursor-default disabled:opacity-25 disabled:hover:bg-ink-950"
                  >
                    <MdiIcon name="arrowRight" size={0.85} />
                  </button>
                </div>
              ) : null}
            </div>

            <ol
              ref={stripRef}
              className={['-mx-6 mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-2 md:-mx-14 md:px-14 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden', classes?.grid].filter(Boolean).join(' ')}
            >
              {cases.map((kase, i) => (
                <li key={kase.client} data-rise={Math.min(i + 1, 3)} data-card className={['w-[85vw] max-w-[400px] shrink-0 snap-start sm:w-[400px]', classes?.card].filter(Boolean).join(' ')}>
                  <CaseCard kase={kase} index={i} total={total} />
                </li>
              ))}
            </ol>

            {total > 1 ? (
              <div className="mt-8 flex items-center gap-4" aria-hidden>
                <div className="relative h-[2px] flex-1 bg-ink-950/10">
                  <span className="absolute inset-y-0 left-0 bg-accent-500 transition-[width] duration-300" style={{ width: `${progress * 100}%` }} />
                </div>
                <span className="font-mono text-[9.5px] capitalize  text-ink-400">{chrome.workDrag}</span>
              </div>
            ) : null}
          </div>
        </GsapReveal>
      </div>
    </section>
  );
}
