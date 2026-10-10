'use client';

import { useRef } from 'react';
import { useInView } from 'framer-motion';

import { BridgeAbout } from '@/components/graphics/bridge-about';
import type { AboutSection as AboutContent, DataProps } from '@/lib/content/types';

/**
 * AboutSection — the about-us section, formerly the hero portal's bridge.
 *
 * Owns its content (`data`, Keystatic-editable via the `about` block) and
 * renders on the primary ground. The renderer mounts it as the hero portal's
 * bridge copy, so it must also fit a 100svh flood: `compact` trades the
 * section rhythm for flood padding. `live` plays the signal plot's draw-in
 * once the section enters the viewport.
 */
export function AboutSection({
  data,
  classes,
  className,
  id,
  compact = false,
}: DataProps<AboutContent, 'root'> & { compact?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });

  return (
    <div
      ref={ref}
      id={id}
      className={[
        'mx-auto w-full max-w-7xl px-5 sm:px-[clamp(20px,6vw,96px)]',
        compact ? 'py-6 md:py-8' : 'py-24 md:py-32',
        classes?.root,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <BridgeAbout data={data} live={inView} />
    </div>
  );
}
