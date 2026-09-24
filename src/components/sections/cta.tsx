import { MdiIcon } from '@/components/motion/mdi-icon';
import { Reveal } from '@/lib/motion/reveal';
import { Cover3D } from '@/lib/motion/scroll-3d';
import type { CtaSection } from '@/lib/content/types';

/** CTA — dark band, flat bordered panel, solid ember square button. */
export function Cta({ cta }: { cta?: CtaSection }) {
  return (
    <section id="audit" data-scene="audit" data-snap className="relative bg-ink-950 py-28 text-[#eceeee] md:py-36">
      <div className="relative mx-auto max-w-[1320px] px-6 md:px-10">
        <Cover3D tilt={8} y={48}>
          <div className="border border-[#eceeee]/15 p-10 md:p-16">
            <Reveal>
              <div className="flex flex-wrap items-center gap-4">
                <p className="mono-label text-[#eceeee]/50">{cta?.eyebrow}</p>
                {cta?.portalLabel ? (
                  <span className="border border-ember/50 px-3 py-1 font-mono text-[10px] uppercase tracking-monoSm text-ember">
                    {cta.portalLabel}
                  </span>
                ) : null}
              </div>
              <h2 className="display mt-6 max-w-3xl text-4xl md:text-[50px] md:leading-[1.08]">{cta?.headline}</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="prose-serif mt-8 max-w-xl text-[#eceeee]/75">{cta?.body}</p>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="mt-12 flex flex-wrap items-center gap-6">
                <a
                  href={cta?.ctaHref ?? '#contact'}
                  className="mono-btn border-ember bg-ember text-white hover:bg-transparent hover:text-white"
                >
                  {cta?.cta} <MdiIcon name="arrowRight" size={0.75} />
                </a>
                <p className="font-mono text-[12px] text-[#eceeee]/50">{cta?.note}</p>
              </div>
            </Reveal>
          </div>
        </Cover3D>
      </div>
    </section>
  );
}
