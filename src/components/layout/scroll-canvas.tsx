'use client';

import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

/**
 * Global scroll-morphing backdrop.
 *
 * A fixed full-viewport canvas behind all content. Each registered scene owns
 * a CSS background; scenes cross-fade fluidly (spring-smoothed) as their
 * section travels through the viewport, so the whole page feels like one
 * continuous gradient journey rather than discrete band swaps.
 */

type Scene = { id: string; background: string };

export const SCENES: Scene[] = [
  {
    id: 'hero',
    background:
      'radial-gradient(1100px 560px at 76% 28%, rgba(79,75,99,0.60), transparent 62%), radial-gradient(820px 460px at 14% 82%, rgba(240,79,38,0.12), transparent 58%), #1c1a26',
  },
  {
    id: 'problem',
    background:
      'radial-gradient(900px 520px at 20% 20%, rgba(79,75,99,0.10), transparent 60%), radial-gradient(700px 420px at 85% 80%, rgba(240,79,38,0.06), transparent 55%), #f7f7fa',
  },
  {
    id: 'belief',
    background:
      'radial-gradient(820px 480px at 80% 30%, rgba(79,75,99,0.14), transparent 60%), radial-gradient(600px 380px at 12% 85%, rgba(240,79,38,0.07), transparent 55%), #eef0f3',
  },
  {
    id: 'process',
    background:
      'radial-gradient(1000px 540px at 72% 30%, rgba(79,75,99,0.50), transparent 62%), radial-gradient(760px 420px at 18% 78%, rgba(240,79,38,0.10), transparent 58%), #232130',
  },
  {
    id: 'capabilities',
    background:
      'radial-gradient(880px 500px at 22% 24%, rgba(79,75,99,0.10), transparent 58%), radial-gradient(680px 400px at 82% 82%, rgba(240,79,38,0.05), transparent 55%), #f4f5f8',
  },
  {
    id: 'work',
    background:
      'radial-gradient(900px 520px at 78% 26%, rgba(79,75,99,0.12), transparent 58%), radial-gradient(640px 400px at 14% 84%, rgba(240,79,38,0.06), transparent 55%), #ffffff',
  },
  {
    id: 'philosophy',
    background:
      'radial-gradient(980px 540px at 74% 30%, rgba(79,75,99,0.55), transparent 60%), radial-gradient(700px 400px at 16% 80%, rgba(240,79,38,0.12), transparent 56%), #1e1c29',
  },
  {
    id: 'industries',
    background:
      'radial-gradient(860px 500px at 24% 26%, rgba(79,75,99,0.09), transparent 58%), radial-gradient(660px 400px at 84% 84%, rgba(240,79,38,0.05), transparent 55%), #f6f6f9',
  },
  {
    id: 'insights',
    background:
      'radial-gradient(840px 480px at 76% 28%, rgba(79,75,99,0.12), transparent 58%), radial-gradient(620px 380px at 18% 82%, rgba(240,79,38,0.06), transparent 55%), #eef0f3',
  },
  {
    id: 'audit',
    background:
      'radial-gradient(820px 420px at 85% 24%, rgba(240,79,38,0.16), transparent 60%), radial-gradient(640px 320px at 12% 88%, rgba(79,75,99,0.55), transparent 58%), #1c1a26',
  },
  {
    id: 'contact',
    background: 'linear-gradient(180deg, #1c1a26 0%, #16141e 100%)',
  },
];

export function ScrollCanvas() {
  const { scrollYProgress } = useScroll();
  // Slow the backdrop down slightly for a weighted, fluid feel.
  const drift = useSpring(scrollYProgress, { stiffness: 60, damping: 26, mass: 0.6 });
  // 3D journey: the whole backdrop breathes toward the camera as you descend,
  // so scene cross-fades feel like forward flight, not flat swaps.
  const journeyScale = useTransform(drift, [0, 1], [1, 1.12]);
  const [activeIds, setActiveIds] = useState<string[]>(['hero']);

  useEffect(() => {
    const scenes = SCENES.map((scene) => ({
      ...scene,
      el: document.getElementById(scene.id),
    })).filter((s): s is Scene & { el: HTMLElement } => Boolean(s.el));

    const observer = new IntersectionObserver(
      (entries) => {
        setActiveIds((prev) => {
          const next = new Set(prev);
          for (const entry of entries) {
            if (entry.isIntersecting) next.add(entry.target.id);
            else next.delete(entry.target.id);
          }
          if (next.size === 0) next.add('hero');
          return [...next];
        });
      },
      // Generous band so two neighbours are ever-visible → true cross-fade.
      { rootMargin: '-18% 0px -18% 0px' },
    );
    scenes.forEach((s) => observer.observe(s.el));
    return () => observer.disconnect();
  }, []);

  // Also react to scrollYProgress for scenes without DOM anchors (robustness).
  useEffect(() => {
    if (activeIds.length > 0) return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drift]);

  return (
    <motion.div aria-hidden className="fixed inset-0 -z-10 overflow-hidden" style={{ scale: journeyScale, transformOrigin: '50% 50%' }}>
      {SCENES.map((scene) => {
        const isActive = activeIds.includes(scene.id);
        return (
          <motion.div
            key={scene.id}
            className="absolute inset-0"
            style={{ background: scene.background }}
            initial={false}
            animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 1.06 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          />
        );
      })}
      {/* film grain keeps gradients alive */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E')]" />
    </motion.div>
  );
}
