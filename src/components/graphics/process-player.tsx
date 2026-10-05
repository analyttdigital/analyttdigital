'use client';

import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

import { ProcessVisual } from '@/components/graphics/process-visuals';
import { MdiIcon } from '@/lib/icons/resolve-icon';
import type { ProcessSection } from '@/lib/content/types';

/**
 * ProcessPlayer — reusable stepped story player.
 *
 * A card with a five-dot stepper on an ember fill rail, an autoplaying detail
 * panel (copy + one step visual), and a play/pause control. Autoplay holds
 * `dwellMs` per step, pauses while the pointer or focus is inside the card,
 * and only runs while the card is on screen. The stepper is a real tablist:
 * roving tabindex with arrow/Home/End keys, `aria-selected` states, and the
 * panel labelled by its tab. Under `prefers-reduced-motion` the player starts
 * paused with its control disabled and every visual renders in final state.
 *
 * Reuse: `<ProcessPlayer data={process} id="unique-prefix" />` — ids are
 * prefixed, so several players can share a page. All copy, chips, visual
 * specs and timings come from `data` (Keystatic-editable).
 */

export function ProcessPlayer({
  data,
  id = 'process-player',
  className,
}: {
  data: ProcessSection;
  /** Prefix for tab/panel ids, so instances never collide on one page. */
  id?: string;
  className?: string;
}) {
  const steps = data.steps ?? [];
  const total = steps.length;
  const [index, setIndex] = useState(0);
  const [paused, setPausedState] = useState(false);
  const [still, setStill] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const idxRef = useRef(0);
  const fracRef = useRef(0);
  const pausedRef = useRef(false);
  const hoveringRef = useRef(false);
  const visibleRef = useRef(false);
  const rafRef = useRef(0);
  const lastRef = useRef(0);
  const dwellRef = useRef(data.dwellMs || 7000);
  dwellRef.current = data.dwellMs || 7000;

  const syncFill = () => {
    const el = fillRef.current;
    if (!el || total < 2) return;
    const p =
      still || (pausedRef.current && fracRef.current === 0)
        ? idxRef.current / (total - 1)
        : (idxRef.current + fracRef.current) / (total - 1);
    el.style.width = `${Math.min(100, p * 100)}%`;
  };

  const kick = () => {
    if (rafRef.current !== 0 || still) return;
    if (!visibleRef.current || pausedRef.current || hoveringRef.current) return;
    lastRef.current = performance.now();
    rafRef.current = requestAnimationFrame(frame);
  };

  const go = (i: number) => {
    if (!total) return;
    const next = ((i % total) + total) % total;
    idxRef.current = next;
    fracRef.current = 0;
    setIndex(next);
    syncFill();
    kick();
  };
  const goRef = useRef(go);
  goRef.current = go;

  function frame(t: number) {
    rafRef.current = 0;
    if (!visibleRef.current || pausedRef.current || hoveringRef.current || still) return;
    const dt = Math.min(100, t - lastRef.current);
    lastRef.current = t;
    fracRef.current += dt / dwellRef.current;
    if (fracRef.current >= 1) {
      goRef.current(idxRef.current + 1);
      return;
    }
    syncFill();
    rafRef.current = requestAnimationFrame(frame);
  }

  const setPaused = (v: boolean) => {
    pausedRef.current = v;
    setPausedState(v);
    syncFill();
    kick();
  };

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setStill(true);
      pausedRef.current = true;
      setPausedState(true);
    }
    const io =
      'IntersectionObserver' in window
        ? new IntersectionObserver(
            (es) => {
              visibleRef.current = es[0].isIntersecting;
              if (visibleRef.current) kick();
            },
            { threshold: 0.25 },
          )
        : null;
    if (io) io.observe(card);
    else {
      visibleRef.current = true;
      kick();
    }
    const onEnter = (e: PointerEvent) => {
      if (e.pointerType !== 'touch') hoveringRef.current = true;
    };
    const onLeave = () => {
      hoveringRef.current = false;
      kick();
    };
    const onFocusIn = () => {
      hoveringRef.current = true;
    };
    const onFocusOut = () => {
      hoveringRef.current = false;
      kick();
    };
    card.addEventListener('pointerenter', onEnter);
    card.addEventListener('pointerleave', onLeave);
    card.addEventListener('focusin', onFocusIn);
    card.addEventListener('focusout', onFocusOut);
    syncFill();
    return () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
      io?.disconnect();
      card.removeEventListener('pointerenter', onEnter);
      card.removeEventListener('pointerleave', onLeave);
      card.removeEventListener('focusin', onFocusIn);
      card.removeEventListener('focusout', onFocusOut);
    };
    // Mount-once engine; dwell flows through dwellRef, UI through React state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!total) return null;
  const step = steps[index] ?? steps[0];
  const counter = (data.stepOfTemplate || 'STEP {n} OF {total}')
    .replace('{n}', step.n || String(index + 1).padStart(2, '0'))
    .replace('{total}', String(total).padStart(2, '0'));

  const onTabKeyDown = (e: KeyboardEvent, i: number) => {
    let to: number | null = null;
    if (e.key === 'ArrowRight') to = (i + 1) % total;
    else if (e.key === 'ArrowLeft') to = (i + total - 1) % total;
    else if (e.key === 'Home') to = 0;
    else if (e.key === 'End') to = total - 1;
    if (to !== null) {
      e.preventDefault();
      go(to);
      document.getElementById(`${id}-tab-${to}`)?.focus();
    }
  };

  return (
    <div
      ref={cardRef}
      className={`rounded-2xl border border-ink-950/10 bg-paper-50 p-5 md:p-7 ${className ?? ''}`}
      style={{ boxShadow: '0 20px 60px rgb(var(--color-primary-600) / 0.10)' }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-[15px] font-medium text-ink-950">{data.cardTitle}</h3>
          <p className="mt-1 text-[13px] text-ink-500">{data.cardSub}</p>
        </div>
        <button
          type="button"
          className="pillbtn"
          aria-pressed={!paused}
          disabled={still}
          onClick={() => setPaused(!paused)}
        >
          <MdiIcon name={paused ? 'play' : 'pause'} size={0.7} />
          <span>{paused ? data.playLabel : data.pauseLabel}</span>
        </button>
      </div>

      {/* Stepper */}
      <div className="relative mt-7">
        <div className="ptrack" aria-hidden="true">
          <div ref={fillRef} className="pfill" />
        </div>
        <div role="tablist" aria-label={data.cardTitle} className="relative grid grid-cols-5">
          {steps.map((s, i) => {
            const state = i < index ? 'done' : i === index ? 'active' : 'todo';
            return (
              <button
                key={s.n || i}
                id={`${id}-tab-${i}`}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-controls={`${id}-panel`}
                tabIndex={i === index ? 0 : -1}
                data-state={state}
                className="pstep"
                onClick={() => go(i)}
                onKeyDown={(e) => onTabKeyDown(e, i)}
              >
                <span className="pdot" aria-hidden="true">
                  {state === 'done' ? <MdiIcon name="check" size={0.6} /> : i + 1}
                </span>
                <span className="plbl">{s.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detail */}
      <div
        role="tabpanel"
        id={`${id}-panel`}
        aria-labelledby={`${id}-tab-${index}`}
        tabIndex={0}
        className="mt-8 grid grid-cols-1 items-stretch gap-6 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-accent-500/40 md:grid-cols-2 md:gap-10"
      >
        <div key={`copy-${index}`} className="pv-in flex flex-col justify-center">
          <div className="text-[12px] font-semibold tracking-[0.14em] text-accent-600">{counter}</div>
          <h4 className="mt-2.5 text-[30px] font-medium leading-[1.1] tracking-[-0.02em] text-ink-950">
            {step.title}
          </h4>
          <p className="mt-3.5 text-[15px] leading-[1.65] text-primary-600">{step.desc}</p>
          <div className="mt-[18px] flex flex-wrap gap-2">
            {(step.chips ?? []).map((c) => (
              <span key={c} className="tagchip">
                {c}
              </span>
            ))}
          </div>
        </div>
        <div
          className="relative min-h-[270px] overflow-hidden rounded-xl border border-ink-950/10 bg-gradient-to-b from-paper-50 to-primary-50"
          style={{
            backgroundImage: 'radial-gradient(rgb(var(--color-primary-600) / 0.10) 1px, transparent 1px)',
            backgroundSize: '18px 18px',
          }}
        >
          <div key={`vis-${index}`} className="flex h-full flex-col justify-center p-4 md:p-5">
            <ProcessVisual visual={step.visual} />
          </div>
          <span className="absolute bottom-2 right-3 text-[10px] text-ink-500">{data.illustrativeNote}</span>
        </div>
      </div>
    </div>
  );
}
