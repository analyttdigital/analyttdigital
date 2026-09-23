import { SectionHeader } from '@/components/motion/section-header';
import { Parallax } from '@/lib/motion/parallax';
import { Reveal } from '@/lib/motion/reveal';
import type { ProblemSection } from '@/lib/content/types';

/** "THE PROBLEM" editorial chapter with progress underline + parallax column. */
export function Problem({ problem }: { problem?: ProblemSection }) {
  return (
    <section id="problem" className="relative py-28 md:py-40">
      <div className="mx-auto grid max-w-[1320px] gap-16 px-6 md:grid-cols-[1fr_1.2fr] md:px-10">
        <SectionHeader eyebrow={problem?.eyebrow ?? ''} title={problem?.headline} />

        <Parallax speed={26} className="space-y-8 md:pt-16">
          {problem?.paragraphs?.map((paragraph, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <p className="prose-serif md:text-[19px]">{paragraph}</p>
            </Reveal>
          ))}
          {problem?.closing ? (
            <Reveal delay={0.2}>
              <p className="display text-2xl text-ember md:text-[28px]">{problem.closing}</p>
            </Reveal>
          ) : null}
        </Parallax>
      </div>
    </section>
  );
}
