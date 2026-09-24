'use client';

import { animate, useInView, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

/**
 * Count-up number that animates when scrolled into view.
 * `value` may be numeric ("2.4") or prefixed/suffixed ("+84%", "9×") — the
 * numeric core is animated, decorations stay static.
 */
export function CountUp({
  value,
  className,
  duration = 1.6,
}: {
  value: string;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15% 0px' });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(reduce ? value : '0');

  useEffect(() => {
    if (!inView || reduce) return;

    const match = value.match(/^([^\d]*)([\d.,]+)(.*)$/);
    if (!match) {
      setDisplay(value);
      return;
    }
    const [, prefix, num, suffix] = match;
    const target = parseFloat(num.replace(/,/g, ''));
    const decimals = num.includes('.') ? num.split('.')[1]?.length ?? 0 : 0;

    const controls = animate(0, target, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) =>
        setDisplay(`${prefix}${v.toLocaleString('en-US', { maximumFractionDigits: decimals, minimumFractionDigits: decimals })}${suffix}`),
    });
    return () => controls.stop();
  }, [inView, value, reduce, duration]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
