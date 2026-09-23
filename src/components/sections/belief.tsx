import { PixelField } from '@/components/graphics/pixel-field';
import { SectionHeader } from '@/components/motion/section-header';
import { Parallax } from '@/lib/motion/parallax';
import { Reveal } from '@/lib/motion/reveal';
import type { BeliefSection } from '@/lib/content/types';

/** "WHAT WE BELIEVE" chapter with parallax pixel motif. */
export function Belief({ belief }: { belief?: BeliefSection }) {
  return (
    <section id="belief" className="relative py-28 md:py-40">
      <div className="mx-auto grid max-w-[1320px] gap-16 px-6 md:grid-cols-[1.15fr_1fr] md:px-10">
        <div>
          <SectionHeader eyebrow={belief?.eyebrow ?? ''} title={belief?.headline} />

          <div className="mt-14 space-y-10">
            {belief?.points?.map((point, i) => (
              <Reveal key={point.title} delay={i * 0.08}>
                <div className="border-t hairline pt-6">
                  <h3 className="font-display text-[22px] font-semibold text-ink-950">{point.title}</h3>
                  <p className="prose-serif mt-3 max-w-lg">{point.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Parallax speed={54} scale className="relative hidden items-center justify-center md:flex">
          <div className="depth-panel relative aspect-square w-full max-w-[400px] rounded-lg border border-ink/10">
            <PixelField seed={7} className="absolute inset-4 h-[calc(100%-2rem)] w-[calc(100%-2rem)]" />
          </div>
        </Parallax>
      </div>
    </section>
  );
}
