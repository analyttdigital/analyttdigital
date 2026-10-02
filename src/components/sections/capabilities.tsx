import { capabilityIcons, MdiIcon } from '@/lib/icons/resolve-icon';
import { SectionHeader } from '@/components/motion/section-header';
import { Reveal } from '@/lib/motion/reveal';
import type { CapabilitiesSection } from '@/lib/content/types';

/**
 * Capabilities — screenshot 4 language: centered headline, pastel gradient
 * tag chips, and a big task-window card with checklist rows (done items
 * checked, others open) plus side annotations.
 */
export function Capabilities({ capabilities }: { capabilities?: CapabilitiesSection }) {
  const items = capabilities?.items ?? [];

  return (
    <section
      id="capabilities"
      data-scene="capabilities"
      data-snap
      className="canvas relative flex min-h-[100svh] items-center overflow-hidden px-4 py-16 md:px-6"
    >
      <div className="stage mx-auto w-full max-w-[1320px] px-6 py-16 md:px-14 md:py-20">
        <SectionHeader eyebrow={capabilities?.eyebrow ?? ''} title={capabilities?.headline} align="center" />

        {/* pastel gradient tag chips */}
        <Reveal delay={0.15}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {items.map((item, i) => (
              <span
                key={item.title}
                className="inline-flex items-center gap-2 rounded-pill px-4 py-2 text-[13px] font-semibold text-ink-800 shadow-button-sm"
                style={{
                  background: `linear-gradient(120deg, rgb(var(--color-accent-100)), rgb(var(--color-paper-DEFAULT)))`,
                }}
              >
                <MdiIcon name={item.icon || capabilityIcons[i % capabilityIcons.length]} size={0.7} className="text-ink-700" />
                {item.tag}
              </span>
            ))}
          </div>
        </Reveal>

        {/* task window */}
        <Reveal delay={0.2}>
          <div className="relative mx-auto mt-12 max-w-3xl">
            <div className="card-float overflow-hidden p-2.5">
              <div className="rounded-2xl bg-paper p-6 md:p-8">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 rounded-pill bg-ink-950 px-5 py-2.5 text-[13px] font-semibold text-paper shadow-button">
                    <MdiIcon name="plus" size={0.7} />
                    Our services
                  </span>
                  <span className="text-[12px] text-ink-400">Paid · Measured · Scaled</span>
                </div>

                <div className="mt-6 grid gap-3 md:grid-cols-2">
                  {items.map((item, i) => (
                    <div
                      key={item.title}
                      className="group flex items-start gap-3 rounded-2xl border border-mist-200 bg-mist-50 p-4 transition-all duration-300 hover:border-accent-300 hover:bg-accent-50"
                    >
                      <span
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-colors ${
                          i % 2 === 0 ? 'bg-ink-950 text-paper' : 'border border-ink-300 bg-paper'
                        }`}
                      >
                        {i % 2 === 0 ? <MdiIcon name="check" size={0.55} /> : null}
                      </span>
                      <div>
                        <p className="text-[15px] font-semibold text-ink-950">{item.title}</p>
                        <p className="mt-1 text-[13.5px] leading-relaxed text-ink-700">{item.body}</p>
                      </div>
                      <span className="ml-auto hidden shrink-0 font-display text-[13px] font-bold text-ink-300 transition-colors group-hover:text-accent-500 md:block">
                        {item.depth ?? String(i + 1).padStart(2, '0')}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-between rounded-2xl bg-mist-100 px-4 py-3">
                  <span className="text-[13px] font-medium text-ink-700">Every campaign tracked to revenue</span>
                  <span className="flex -space-x-1.5">
                    {['A', 'M', 'Z'].map((letter) => (
                      <span
                        key={letter}
                        className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-paper bg-accent-200 text-[10px] font-bold text-ink-800"
                      >
                        {letter}
                      </span>
                    ))}
                  </span>
                </div>
              </div>
            </div>

            {/* side annotations — screenshot 4 language */}
            <p className="absolute -left-64 top-1/3 hidden w-48 text-[13.5px] leading-relaxed text-ink-600 xl:block">
              {items[0]?.body}
            </p>
            <p className="absolute -right-64 bottom-1/4 hidden w-48 text-[13.5px] leading-relaxed text-ink-600 xl:block">
              Every report ends in an action — what to scale, cut or test next.
            </p>
          </div>
        </Reveal>

        <div aria-hidden className="blob blob--lavender -left-16 bottom-0 h-56 w-56 opacity-60" />
      </div>
    </section>
  );
}
