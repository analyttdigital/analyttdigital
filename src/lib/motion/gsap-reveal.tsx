'use client';

import { useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

/**
 * The soft-signal motion kit — GSAP-driven, Lenis-compatible.
 *
 * `GsapReveal` scopes two declarative behaviours over its subtree:
 *   [data-rise]   entrance — rise + de-blur, staggered by attribute value,
 *                 fired once by ScrollTrigger when the element nears view.
 *   [data-drift]  transition — a scroll-scrubbed parallax drift, so bands
 *                 hand over with visible motion instead of a hard cut.
 * `TiltCard` is the interactive surface: pointer tilt with perspective and
 * an ember spotlight that follows the cursor. `Magnetic` pulls its child
 * toward the pointer and snaps it back with an elastic settle.
 * Everything in this module is inert under `prefers-reduced-motion`.
 */

const REDUCED = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function GsapReveal({ children, className }: { children: ReactNode; className?: string }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (REDUCED() || !scope.current) return;

      gsap.utils.toArray<HTMLElement>('[data-rise]', scope.current).forEach((el) => {
        gsap.fromTo(
          el,
          { y: 36, autoAlpha: 0, filter: 'blur(8px)' },
          {
            y: 0,
            autoAlpha: 1,
            filter: 'blur(0px)',
            duration: 0.9,
            ease: 'power3.out',
            delay: Number(el.dataset.rise || 0) * 0.09,
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>('[data-drift]', scope.current).forEach((el) => {
        const amount = Number(el.dataset.drift || 40);
        gsap.fromTo(
          el,
          { y: amount },
          {
            y: -amount,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        );
      });
    },
    { scope },
  );

  return (
    <div ref={scope} className={className ?? 'contents'}>
      {children}
    </div>
  );
}

export function TiltCard({
  children,
  className,
  max = 6,
}: {
  children: ReactNode;
  className?: string;
  /** Degrees of tilt at the card's edge. */
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (REDUCED() || e.pointerType !== 'mouse' || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const py = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    ref.current.style.setProperty('--mx', `${((px + 1) / 2) * 100}%`);
    ref.current.style.setProperty('--my', `${((py + 1) / 2) * 100}%`);
    gsap.to(ref.current, {
      rotationY: px * max,
      rotationX: -py * max,
      transformPerspective: 900,
      duration: 0.5,
      ease: 'power2.out',
    });
  };

  const onLeave = () => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      rotationX: 0,
      rotationY: 0,
      duration: 0.8,
      ease: 'elastic.out(1, 0.55)',
    });
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`group/t relative ${className ?? ''}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/t:opacity-100"
        style={{
          background:
            'radial-gradient(340px circle at var(--mx, 50%) var(--my, 50%), rgb(var(--color-accent-500) / 0.13), transparent 65%)',
        }}
      />
      {children}
    </div>
  );
}

export function Magnetic({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (REDUCED() || e.pointerType !== 'mouse' || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = e.clientX - (rect.left + rect.width / 2);
    const py = e.clientY - (rect.top + rect.height / 2);
    gsap.to(ref.current, { x: px * 0.28, y: py * 0.32, duration: 0.4, ease: 'power2.out' });
  };

  const onLeave = () => {
    if (!ref.current) return;
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.4)' });
  };

  return (
    <div ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} className={className}>
      {children}
    </div>
  );
}
