import { capabilityIcons, MdiIcon } from '@/components/motion/mdi-icon';
import { SectionHeader } from '@/components/motion/section-header';
import { Cover3D } from '@/lib/motion/scroll-3d';
import type { CapabilitiesSection } from '@/lib/content/types';

/** Capabilities — flat bordered service list, hairline grid, ember icons. */
export function Capabilities({ capabilities }: { capabilities?: CapabilitiesSection }) {
  const items = capabilities?.items ?? [];

  return (
    <section id="capabilities" data-scene="capabilities" data-snap className="relative bg-paper py-28 md:py-40">
      <div className="mx-auto max-w-[1320px] px-6 md:px-10">
        <SectionHeader eyebrow={capabilities?.eyebrow ?? ''} title={capabilities?.headline} />

        <div className="mt-16 grid gap-px border hairline bg-line sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <Cover3D key={item.title} delay={i * 0.07} tilt={10} y={44} className="bg-paper">
              <article className="group flex h-full flex-col bg-paper p-8 transition-colors duration-300 hover:bg-mist">
                <div className="flex items-center justify-between">
                  <MdiIcon name={capabilityIcons[i % capabilityIcons.length]} size={0.9} className="text-ember" />
                  <span className="mono-label text-ink/40">{item.depth ?? String(i + 1).padStart(2, '0')}</span>
                </div>
                <p className="mono-label mt-8 text-ember">{item.tag}</p>
                <h3 className="mt-3 font-display text-[19px] font-semibold leading-snug text-ink-950">{item.title}</h3>
                <p className="prose-serif mt-3 text-[14.5px] leading-[1.6]">{item.body}</p>
                <span aria-hidden className="mt-auto block h-px w-full bg-ink/10 pt-8">
                  <span className="block h-px w-0 bg-ember transition-all duration-500 group-hover:w-full" />
                </span>
              </article>
            </Cover3D>
          ))}
        </div>
      </div>
    </section>
  );
}
