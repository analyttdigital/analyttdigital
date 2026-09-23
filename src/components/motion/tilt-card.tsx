'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import type { ReactNode } from 'react';

/**
 * Pointer-tracked 3D tilt card. Subtle by design (max ~5deg) with spring
 * smoothing and a light-sweep highlight that follows the cursor.
 */
export function TiltCard({
  children,
  className,
  max = 5,
  glare = true,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  glare?: boolean;
}) {
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const spring = { stiffness: 160, damping: 22, mass: 0.4 };
  const rx = useSpring(useTransform(py, [0, 1], [max, -max]), spring);
  const ry = useSpring(useTransform(px, [0, 1], [-max, max]), spring);
  const glareX = useTransform(px, [0, 1], ['12%', '88%']);
  const glareY = useTransform(py, [0, 1], ['8%', '92%']);
  const glareOpacity = useSpring(0, { stiffness: 200, damping: 30 });

  return (
    <motion.div
      className={`relative [transform-style:preserve-3d] ${className ?? ''}`}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        px.set((event.clientX - rect.left) / rect.width);
        py.set((event.clientY - rect.top) / rect.height);
        glareOpacity.set(0.5);
      }}
      onPointerLeave={() => {
        px.set(0.5);
        py.set(0.5);
        glareOpacity.set(0);
      }}
    >
      {children}
      {glare ? (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: glareOpacity,
            background: useTransform(
              [glareX, glareY],
              ([x, y]) => `radial-gradient(420px circle at ${x} ${y}, rgba(255,255,255,0.35), transparent 55%)`,
            ),
          }}
        />
      ) : null}
    </motion.div>
  );
}
