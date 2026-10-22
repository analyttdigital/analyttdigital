'use client';

import type { MotionValue } from 'framer-motion';
import { useEffect, useRef } from 'react';

import { runHeroGather } from './hero-gather-scene';

/**
 * Hero gather — the WebGL logo-gather from html.bak/analytt-hero-gather-tailwind.html.
 * Icons spiral into the Analytt mark, ambient ad bubbles drift past, the
 * pointer repels/lights them, and a click splashes them off the silhouette.
 *
 * `progress` is the hero's single scroll-progress source, read imperatively
 * inside the render loop (never via React state): the mark spins up and the
 * camera dollies in as the portal opens, and rendering pauses once the
 * portal fully covers the stage.
 */
export function HeroGather({ progress }: { progress?: MotionValue<number> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
    
  useEffect(() => {
    const canvas = canvasRef.current;
    // Scope to the sticky stage (not the tall runway section) so layout
    // math sees viewport-sized bounds and pointer events stay on the stage.
    const scope = canvas?.closest('[data-hero-stage]') ?? canvas?.closest('section');
    if (!canvas || !(scope instanceof HTMLElement)) return;
    const dispose = runHeroGather(scope, canvas, {
      getProgress: progress ? () => progress.get() : undefined,
    });
    return () => dispose?.();
  }, [progress]);

  return (
    <>
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 z-0 block h-full w-full" />
      {/* fallback mark, shown only if WebGL is unavailable */}
      <svg
        viewBox="0 0 360 360"
        aria-hidden="true"
        className="absolute right-1/2 top-[90px] z-0 hidden w-[min(70vw,360px)] translate-x-1/2 group-[.no-gl]:block md:right-[8%] md:top-1/2 md:w-[min(44vw,520px)] md:-translate-y-1/2 md:translate-x-0"
      >
        <defs>
          <linearGradient id="fbg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#4f4b63" />
            <stop offset="1" stopColor="#f04f26" />
          </linearGradient>
        </defs>
        <path
          fill="url(#fbg)"
          d="m143.08 211.84h29.629v79.031h-58.867q-35.087 0-54.969-20.977-19.882-20.983-19.882-57.647v-72.921h-38.985v-22.406l104.87-116.92h18.713v70.884h47.952v68.439h-45.223v54.996q0 7.7402 4.4859 12.629 4.4807 4.8885 12.278 4.8885z"
        />
        <path
          fill="url(#fbg)"
          d="m214.95 148.93h-30.037v-78.746h59.679q35.57 0 55.727 20.901 20.156 20.907 20.156 57.438v72.657h39.522v22.325l-106.32 116.5h-18.971v-70.628h-48.613v-68.192h45.846v-54.797q0-7.7122-4.5477-12.583-4.5425-4.8708-12.447-4.8708z"
        />
      </svg>
    </>
  );
}
