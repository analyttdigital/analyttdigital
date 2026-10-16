import { useEffect, useRef } from "react";
import { DropZone } from "@measured/puck";
import { mdiEye } from "@mdi/js";
import { z } from "zod";

import { registerComponent } from "@/builder/registry";
import type { RegisterComponentOptions } from "@/builder/registry";

/**
 * GSAP scroll-reveal wrapper (M8). Children (any blocks via DropZone) animate
 * in on scroll. GSAP + ScrollTrigger load lazily inside the effect so the
 * editor/public bundles never pay for them until a reveal actually mounts;
 * `gsap.context` scopes selectors and `revert()` cleans up on unmount or
 * prop change. While editing, children render statically so drag and drop
 * stays precise.
 */

export const GsapRevealSchema = z.object({
  variant: z.enum(["fade", "slide-up", "slide-left", "scale"]).describe("Animation").default("fade"),
  duration: z.number().describe("Duration (seconds)").default(0.7),
  delay: z.number().describe("Delay (seconds)").default(0),
  distance: z.number().describe("Travel distance (px, slides only)").default(40),
  once: z.boolean().describe("Play once").default(true),
});

export type GsapRevealProps = z.infer<typeof GsapRevealSchema>;

export function GsapReveal({
  variant,
  duration,
  delay,
  distance,
  once,
  editing,
}: GsapRevealProps & { editing?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editing) return;
    let cancelled = false;
    let revert: (() => void) | undefined;
    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled || !ref.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const from: Record<string, number> = { opacity: 0 };
      if (variant === "slide-up") from.y = distance;
      if (variant === "slide-left") from.x = distance;
      if (variant === "scale") from.scale = 0.92;
      const ctx = gsap.context(() => {
        gsap.from(ref.current, {
          ...from,
          duration,
          delay,
          ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start: "top 88%", once },
        });
      }, ref);
      revert = () => ctx.revert();
    })();
    return () => {
      cancelled = true;
      revert?.();
    };
  }, [variant, duration, delay, distance, once, editing]);

  return (
    <div ref={ref}>
      <DropZone zone="reveal" />
    </div>
  );
}

export const gsapRevealOptions: RegisterComponentOptions<GsapRevealProps> = {
  name: "GsapReveal",
  label: "Scroll reveal",
  category: "Advanced",
  icon: mdiEye,
  schema: GsapRevealSchema,
  render: GsapReveal,
};

export function registerGsapReveal(): void {
  registerComponent(gsapRevealOptions);
}

registerGsapReveal();
