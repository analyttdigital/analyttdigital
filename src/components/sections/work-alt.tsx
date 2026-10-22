import Link from '@/components/ui/link';
import { DynamicImage, MediaSlot } from '@/components/media/dynamic-image';
import { InViewTitle } from '@/components/ui/in-view-title';
import { useChrome } from '@/lib/content/chrome';
import type { DataProps, WorkSection } from '@/lib/content/types';
import { MdiIcon } from '@/lib/icons/resolve-icon';
import { GsapReveal } from '@/lib/motion/gsap-reveal';

/**
 * WorkAlt — selected cases as stacked editorial rows.
 *
 * Where `Work` cards lead with a media banner, the alt keeps imagery to a
 * small thumb beside the copy: mono meta, client title, body, and the
 * ember proof figure inline. No strip, no controls, no client state.
 * Photo first via the shared media resolver (`MediaSlot` placeholder when
 * artless). Content shape unchanged.
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
                <Link
                  href={data.ctaHref || '#'}
                  className="inline-flex items-center gap-2.5 rounded-full bg-ink-950 px-6 py-3.5 text-sm font-medium text-paper-50 transition-colors duration-200 hover:bg-primary-700"
                >
                  {data.cta}
                  <MdiIcon name="arrowRight" size={0.8} />
                </Link>
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
                  className={`flex gap-5 rounded-3xl border border-ink-950/[0.07] bg-paper-50 p-5 md:p-6 ${classes?.row ?? ''}`}
                >
                  <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl sm:h-32 sm:w-32">
                    {kase.image?.src?.trim() ? (
                      <DynamicImage
                        image={kase.image}
                        sizes="256px"
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
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] capitalize tracking-[0.16em] text-ink-400">
                      <span className="num text-accent-600">
                        {kase.depth || String(i + 1).padStart(2, '0')}
                      </span>
                      <span aria-hidden className="h-1 w-1 bg-ink-950/20" />
                      <span>{kase.industry}</span>
                      {kase.tag ? (
                        <span className="rounded-full bg-paper-50 px-2 py-0.5 text-accent-700 ring-1 ring-ink-950/10">
                          {kase.tag}
                        </span>
                      ) : null}
                    </p>
                    <h3 className="verb mt-2 text-[clamp(1.2rem,2vw,1.5rem)] font-mono leading-snug text-ink-950">
                      {kase.client}
                    </h3>
                    {kase.headline ? (
                      <p className="mt-1 text-sm font-medium text-ink-700">{kase.headline}</p>
                    ) : null}
                    <p className="mt-2 max-w-[52ch] text-[13px] leading-[1.8] text-ink-500">
                      {kase.body}
                    </p>
                    <div className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-1 border-t border-ink-950/10 pt-3">
                      <p className="num text-[clamp(1.3rem,2vw,1.7rem)] leading-none text-accent-600">
                        {kase.metric}
                      </p>
                      <p className="font-mono text-[9.5px] capitalize leading-relaxed text-ink-500">
                        {kase.metricLabel}
                      </p>
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
