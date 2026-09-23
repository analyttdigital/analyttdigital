import { PixelField } from '@/components/graphics/pixel-field';
import { SectionHeader } from '@/components/motion/section-header';
import { TiltCard } from '@/components/motion/tilt-card';
import { Reveal } from '@/lib/motion/reveal';
import type { CapabilitiesSection } from '@/lib/content/types';

/** "OUR SERVICES" — 3D tilt cards with pixel motifs and glare. */
export function Capabilities({ capabilities }: { capabilities?: CapabilitiesSection }) {
  const items = capabilities?.items ?? [];

  return (
    <section id="capabilities" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-[1320px] px-6 md:px-10">
        <SectionHeader eyebrow={capabilities?.eyebrow ?? ''} title={capabilities?.headline} />

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" style={{ perspective: '1200px' }}>
          {items.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.07}>
              <TiltCard max={6} className="h-full">
                <article className="depth-panel depth-float flex h-full flex-col rounded-lg border border-ink/10 p-6">
                  <span className="mono-label ml-auto border border-ink/20 bg-white/60 px-3 py-1.5 text-ink/70">{item.tag}</span>
                  <div className="relative mx-auto my-10 aspect-square w-full max-w-[170px]">
                    <PixelField seed={11 + i * 3} density={0.35 + i * 0.06} className="h-full w-full" />
                  </div>
                  <h3 className="font-display text-[20px] font-semibold text-ink-950">{item.title}</h3>
                  <p className="prose-serif mt-3 text-[15px] leading-[1.6]">{item.body}</p>
                </article>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
