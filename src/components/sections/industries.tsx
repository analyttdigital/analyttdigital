import { SectionHeader } from '@/components/motion/section-header';
import { Parallax } from '@/lib/motion/parallax';
import { Reveal } from '@/lib/motion/reveal';
import type { IndustriesSection } from '@/lib/content/types';

/** "SECTORS" — chip grid with depth-float hover and gentle parallax. */
export function Industries({ industries }: { industries?: IndustriesSection }) {
  return (
    <section id="industries" className="relative py-28 md:py-36">
      <div className="mx-auto grid max-w-[1320px] gap-12 px-6 md:grid-cols-[1fr_1.2fr] md:px-10">
        <SectionHeader eyebrow={industries?.eyebrow ?? ''} title={industries?.headline}>
          <p className="prose-serif mt-6 max-w-md">{industries?.body}</p>
        </SectionHeader>

        <Parallax speed={20} className="flex flex-wrap content-start gap-3 md:pt-16">
          {industries?.items?.map((item, i) => (
            <Reveal key={item} delay={i * 0.03}>
              <span className="depth-panel depth-float inline-flex cursor-default items-center rounded border border-ink/20 px-5 py-3 font-mono text-[12px] uppercase tracking-monoSm text-ink/80 transition-colors hover:border-ember hover:text-ember">
                {item}
              </span>
            </Reveal>
          ))}
        </Parallax>
      </div>
    </section>
  );
}
