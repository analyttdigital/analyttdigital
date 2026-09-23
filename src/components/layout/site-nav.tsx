import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import Link from 'next/link';

import type { LayoutContent } from '@/lib/content/types';

/**
 * Fixed site chrome: brand + links + CTA (Oxigen-style mono uppercase).
 * Transparent with light text over the dark hero, cross-fading to a solid
 * light bar with ink text after ~80px of scroll.
 */
export function SiteNav({ nav }: { nav?: LayoutContent }) {
  const { scrollY } = useScroll();
  const bg = useTransform(scrollY, [0, 80], ['rgba(255,255,255,0)', 'rgba(255,255,255,0.92)']);
  const border = useTransform(scrollY, [0, 80], ['rgba(79,75,99,0)', 'rgba(79,75,99,0.12)']);
  const shadow = useTransform(scrollY, [0, 80], ['0 0 0 rgba(0,0,0,0)', '0 8px 30px rgba(28,26,38,0.06)']);
  const brandColor = useTransform(scrollY, [0, 80], ['#eceeee', '#1c1a26']);
  const linkColor = useTransform(scrollY, [0, 80], ['rgba(236,238,238,0.85)', 'rgba(79,75,99,1)']);
  const ctaBorder = useTransform(scrollY, [0, 80], ['rgba(236,238,238,0.3)', 'rgba(79,75,99,0.25)']);
  const ctaColor = useTransform(scrollY, [0, 80], ['#eceeee', '#4f4b63']);
  const spring = { stiffness: 120, damping: 30 };
  const bgSpring = useSpring(bg, spring);
  const borderSpring = useSpring(border, spring);
  const shadowSpring = useSpring(shadow, spring);

  const brand = nav?.brand ?? 'analytt';
  const emphasis = nav?.brandEmphasis ?? 'digital';
  const links = nav?.navLinks ?? [];
  const cta = nav?.navCta ?? 'Get a free audit';
  const ctaHref = nav?.navCtaHref ?? '#contact';

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50"
      style={{ background: bgSpring, borderBottom: '1px solid', borderBottomColor: borderSpring, boxShadow: shadowSpring }}
    >
      <div className="mx-auto flex max-w-[1320px] items-center justify-between px-6 py-5 md:px-10">
        <Link href="/" className="font-display text-[22px] font-semibold tracking-tight">
          <motion.span style={{ color: brandColor }}>{brand}</motion.span>
          <span className="text-ember">{emphasis}</span>
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          {links.map((link) => (
            <motion.a
              key={link.label}
              href={link.href}
              style={{ color: linkColor }}
              className="font-mono text-[12px] uppercase tracking-monoSm transition-colors hover:text-ember"
            >
              {link.label}
            </motion.a>
          ))}
        </nav>

        <motion.a
          href={ctaHref}
          style={{ color: ctaColor, borderColor: ctaBorder }}
          className="mono-btn hover:border-ember hover:bg-ember hover:text-white"
        >
          {cta}
        </motion.a>
      </div>
    </motion.header>
  );
}
