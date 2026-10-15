import { DynamicImage, MediaSlot } from '@/components/media/dynamic-image';
import { InViewTitle } from '@/components/graphics/in-view-title';
import { useChrome } from '@/lib/content/chrome';
import type { DataProps, WorkSection } from '@/lib/content/types';
import { MdiIcon } from '@/lib/icons/resolve-icon';
import { GsapReveal } from '@/lib/motion/gsap-reveal';

/**
 * WorkAlt — selected cases as stacked editorial rows.
 *
 * Where `Work` runs a snap-scrolling filmstrip with nudge keys and a meter,
 * the alt lays the same cases out as alternating media/copy rows on paper —
 * no strip, no controls, no client state. Photo first via the shared media
 * resolver (`MediaSlot` placeholder when artless), mono meta, client title,
 * body, and the ember proof figure. Content shape unchanged.
 */
export function WorkAlt({ data, classes, className, id }: DataProps<WorkSection, 'head' | 'rows' | 'row'>) {
  const cases = data?.cases ?? [];
  const chrome = useChrome();

  return (
    <section id={id ?? 'work'} className={`relative overflow-hidden bg-paper py-20 md:py-28 ${className ?? ''}`}>
      <div
        className={['relative mx-auto w-full max-w-7xl px-5 md:px-8', classes?.head]
          .filter(Boolean)
          .join(' ')}
      >
        <GsapReveal>
          <div data-rise>
            <p className="label text-ink-500">{data?.eyebrow}</p>
            <InViewTitle
              text={(data?.headline ?? '').replace(/\n/g, ' ')}
              variant="blur"
              as="h2"
              className="title mt-7 max-w-[16ch] text-[clamp(2rem,4vw,2.8rem)] text-ink-950"
            />
            {data?.body ? (
              <p className="mt-6 max-w-[52ch] text-sm leading-[1.85] text-ink-500 md:text-base">
                {data.body}
              </p>
            ) : null}
            {data?.cta ? (
              <p className="mt-8">
                <a
                  href={data.ctaHref || '#'}
                  className="inline-flex items-center gap-2.5 rounded-full bg-ink-950 px-6 py-3.5 text-sm font-medium text-paper-50 transition-colors duration-200 hover:bg-primary-700"
                >
                  {data.cta}
                  <MdiIcon name="arrowRight" size={0.8} />
                </a>
              </p>
            ) : null}
          </div>

          {cases.length > 0 ? (
            <ol
              className={['mt-14 grid gap-6', classes?.rows].filter(Boolean).join(' ')}
            >
              {cases.map((kase, i) => (
                <li
                  key={kase.client || i}
                  data-rise={Math.min(i + 1, 3)}
                  className={`grid overflow-hidden rounded-3xl border border-ink-950/[0.07] bg-paper-50 md:grid-cols-2 ${classes?.row ?? ''}`}
                >
                  <div className={`relative min-h-28 overflow-hidden ${i % 2 === 1 ? 'md:order-2' : ''}`}>
                    {kase.image?.src?.trim() ? (
                      <DynamicImage
                        image={kase.image}
                        sizes="(max-width: 24rem) 100vw, 50vw"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    ) : (
                      <MediaSlot
                        image={null}
                        icon="document"
                        label={chrome.mediaSlot}
                        tone="paper"
                        className="absolute inset-0 h-full w-full"
                      />
                    )}
                    {kase.tag ? (
                      <span className="absolute right-5 top-5 rounded-full bg-paper-50/90 px-2.5 py-1 font-mono text-[10px] capitalize text-accent-700 backdrop-blur-sm">
                        {kase.tag}
                      </span>
                    ) : null}
                  </div>
                  <div className="flex flex-col p-7 md:p-10">
                    <p className="flex items-center gap-3 font-mono text-[10px] capitalize tracking-[0.16em] text-ink-400">
                      <span className="num text-accent-600">
                        {kase.depth || String(i + 1).padStart(2, '0')}
                      </span>
                      <span aria-hidden className="h-1 w-1 bg-ink-950/20" />
                      <span>{kase.industry}</span>
                    </p>
                    <h3 className="verb mt-4 text-[clamp(1.4rem,2.4vw,2rem)] leading-snug text-ink-950">
                      {kase.client}
                    </h3>
                    {kase.headline ? (
                      <p className="mt-2 text-sm font-medium text-ink-700">{kase.headline}</p>
                    ) : null}
                    <p className="mt-3 max-w-[52ch] text-[13px] leading-[1.8] text-ink-500">
                      {kase.body}
                    </p>
                    <div className="mt-auto pt-6">
                      <div className="border-t border-ink-950/10 pt-4">
                        <p className="num text-[clamp(1.6rem,2.6vw,2.2rem)] leading-none text-accent-600">
                          {kase.metric}
                        </p>
                        <p className="mt-1.5 font-mono text-[9.5px] capitalize leading-relaxed text-ink-500">
                          {kase.metricLabel}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          ) : null}
        </GsapReveal>
      </div>
    </section>
  );
}
