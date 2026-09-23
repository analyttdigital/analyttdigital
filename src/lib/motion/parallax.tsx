import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, type ReactNode } from 'react';

/**
 * Scroll-parallax wrapper: drifts children vertically (and optionally scales)
 * as the element travels through the viewport. `speed` is the drift distance
 * in px — positive moves up, negative moves down.
 */
export function Parallax({
  children,
  speed = 40,
  scale = false,
  className,
}: {
  children: ReactNode;
  speed?: number;
  scale?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [speed, -speed]);
  const scaleTransform = useTransform(scrollYProgress, [0, 0.5, 1], scale ? [0.94, 1, 0.94] : [1, 1, 1]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y, scale: scaleTransform }}>{children}</motion.div>
    </div>
  );
}

/**
 * Depth-layers: renders children stacked with per-layer parallax speeds for a
 * subtle 3D scene feel. Layers receive their index (0 = farthest).
 */
export function DepthScene({
  layers,
  className,
  baseSpeed = 24,
}: {
  layers: ReactNode[];
  className?: string;
  baseSpeed?: number;
}) {
  return (
    <div className={`relative ${className ?? ''}`}>
      {layers.map((layer, i) => (
        <Parallax key={i} speed={baseSpeed * (layers.length - i)} className="absolute inset-0">
          {layer}
        </Parallax>
      ))}
    </div>
  );
}
