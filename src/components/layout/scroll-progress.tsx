'use client';

import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

/**
 * Scroll progress system:
 * - top ember bar tracking overall page progress
 * - right rail with chapter ticks; the in-view chapter shows its label
 * - small percentage readout under the rail
 */
export function ScrollProgress({ chapters }: { chapters: { id: string; label: string }[] }) {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const pctText = useTransform(progress, (v) => `${Math.round(v * 100)}`);
  const [pct, setPct] = useState('0');
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => pctText.on('change', setPct), [pctText]);

  useEffect(() => {
    const sections = chapters
      .map((c) => ({ ...c, el: document.getElementById(c.id) }))
      .filter((c): c is { id: string; label: string; el: HTMLElement } => Boolean(c.el));

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    sections.forEach((s) => observer.observe(s.el));
    return () => observer.disconnect();
  }, [chapters]);

  const activeLabel = chapters.find((c) => c.id === active)?.label;

  return (
    <>
      {/* top progress bar */}
      <motion.div
        aria-hidden
        className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-ember"
        style={{ scaleX: progress }}
      />

      {/* right rail */}
      <div className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 md:block">
        <div className="relative h-40 w-px bg-ink/15">
          <motion.div className="absolute left-0 top-0 h-full w-px origin-top bg-ember" style={{ scaleY: progress }} />
        </div>
        <motion.p className="mt-3 text-right font-mono text-[10px] tracking-monoSm text-ink/60">{pct}%</motion.p>
      </div>

      {/* chapter ticks */}
      <div className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-4 md:flex" style={{ marginTop: '11rem' }}>
        {chapters.map((chapter) => (
          <a key={chapter.id} href={`#${chapter.id}`} className="group flex items-center gap-2" aria-label={chapter.label}>
            <span
              className={`font-mono text-[10px] uppercase tracking-monoSm text-ink transition-all duration-300 ${
                active === chapter.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'
              }`}
            >
              {chapter.label}
            </span>
            <span
              className={`h-px transition-all duration-300 ${
                active === chapter.id ? 'w-8 bg-ember' : 'w-4 bg-ink/30 group-hover:w-6 group-hover:bg-ink/60'
              }`}
            />
          </a>
        ))}
      </div>

      {/* active chapter label pinned right */}
      <div className="fixed right-10 top-1/2 z-40 hidden -translate-y-1/2 md:block" aria-live="polite">
        <motion.span
          key={activeLabel}
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="font-mono text-[11px] uppercase tracking-mono text-ink"
        >
          {activeLabel}
        </motion.span>
      </div>
    </>
  );
}
