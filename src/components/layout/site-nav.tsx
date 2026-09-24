import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { MdiIcon } from '@/components/motion/mdi-icon';
import type { LayoutContent } from '@/lib/content/types';

const DARK_SCENES = new Set(['hero', 'process', 'philosophy', 'audit', 'contact']);

/**
 * Fixed site chrome: brand + links + CTA (Oxigen-style mono uppercase).
 * Scene-aware: light text over dark scenes (hero/process/stats/cta/footer),
 * solid light bar with ink text over light scenes. Glass blur past the hero.
 */
export function SiteNav({ nav }: { nav?: LayoutContent }) {
  const { scrollY } = useScroll();
  const barBg = useTransform(
    scrollY,
    [0, 80],
    ['rgba(28,26,38,0)', 'rgba(28,26,38,0.72)'],
  );
  const [onDark, setOnDark] = useState(true);

  // Track which scene id sits under the nav to choose text colors. The nav is
  // fixed, so hit-testing would hit the nav itself — instead find the scene
  // section whose document-space rect contains a probe line just below it.
  useEffect(() => {
    const update = () => {
      const probeY = window.scrollY + 48;
      const scenes = document.querySelectorAll<HTMLElement>('[data-scene]');
      let current: string | null = null;
      scenes.forEach((el) => {
        const top = el.getBoundingClientRect().top + window.scrollY;
        const bottom = top + el.offsetHeight;
        if (probeY >= top && probeY < bottom) current = el.getAttribute('data-scene');
      });
      if (current) setOnDark(DARK_SCENES.has(current));
    };
    update();
    const t = window.setInterval(update, 250);
    window.addEventListener('resize', update);
    return () => {
      window.clearInterval(t);
      window.removeEventListener('resize', update);
    };
  }, []);

  const brand = nav?.brand ?? 'analytt';
  const emphasis = nav?.brandEmphasis ?? 'digital';
  const links = nav?.navLinks ?? [];
  const cta = nav?.navCta ?? 'Get a free audit';
  const ctaHref = nav?.navCtaHref ?? '#contact';

  const tone = onDark
    ? { bg: 'rgba(28,26,38,0)', text: '#eceeee', border: 'rgba(236,238,238,0.3)' }
    : { bg: '#ffffff', text: '#1c1a26', border: 'rgba(79,75,99,0.25)' };

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50 border-b transition-colors duration-500"
      style={{
        backgroundColor: onDark ? barBg : tone.bg,
        borderBottomColor: onDark ? 'rgba(236,238,238,0.12)' : 'rgba(79,75,99,0.15)',
      }}
    >
      <div className="mx-auto flex max-w-[1320px] items-center justify-between px-6 py-5 md:px-10">
        <Link href="/" className="font-display text-[22px] font-semibold tracking-tight" style={{ color: tone.text }}>
          {brand}
          <span className="text-ember">{emphasis}</span>
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              style={{ color: tone.text }}
              className="font-mono text-[12px] uppercase tracking-monoSm opacity-90 transition-colors hover:text-ember"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href={ctaHref}
          style={{ color: tone.text, borderColor: tone.border }}
          className="mono-btn hover:border-ember hover:bg-ember hover:text-white"
        >
          {cta} <MdiIcon name="arrowTopRight" size={0.7} />
        </a>
      </div>
    </motion.header>
  );
}
