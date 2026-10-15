import { InViewTitle } from '@/components/graphics/in-view-title';
import type { CapabilitiesSection, DataProps } from '@/lib/content/types';
import { MdiIcon, capabilityIcons } from '@/lib/icons/resolve-icon';
import { GsapReveal } from '@/lib/motion/gsap-reveal';

/**
 * CapabilitiesAlt — the engagement as a static ledger.
 *
 * Where `Capabilities` stages deep-field plates with readout instruments and
 * an order toggle, the alt is a ruled index: one row per service (icon tile,
 * mono position + tag, title, body) with the readout reduced to its
 * measurement line (value, label, caption) instead of the figure. Content
 * order is kept — no toggle, no client state — so this stays a server
 * component. Content shape unchanged.
 */
export function CapabilitiesAlt({
  data,
  classes,
  className,
  id,
}: DataProps<CapabilitiesSection, 'head' | 'rows' | 'row'>) {
  const items = data?.items ?? [];

  return (
    <section id={id ?? 'capabilities'} className={`relative overflow-hidden bg-paper py-20 md:py-28 ${className ?? ''}`}>
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
              className="title mt-7 max-w-[18ch] text-[clamp(2rem,4vw,2.8rem)] text-ink-950"
            />
            {data?.lede ? (
              <p className="mt-6 max-w-[62ch] text-sm leading-[1.85] text-ink-500 md:text-base">
                {data.lede}
              </p>
            ) : null}
          </div>

          {items.length > 0 ? (
            <ol
              className={['mt-12 border-t border-ink-950/10', classes?.rows]
                .filter(Boolean)
                .join(' ')}
            >
              {items.map((item, i) => (
                <li
                  key={item.title || i}
                  data-rise={Math.min(i + 1, 3)}
                  className={`grid gap-5 border-b border-ink-950/10 py-8 md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-start md:gap-8 ${classes?.row ?? ''}`}
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ink-950 text-paper-50">
                    <MdiIcon
                      name={item.icon || capabilityIcons[i % capabilityIcons.length]}
                      size={0.9}
                    />
                  </span>
                  <div>
                    <p className="flex items-center gap-3 font-mono text-[9.5px] capitalize tracking-[0.16em] text-ink-400">
                      <span className="num text-accent-600">
                        {item.depth || String(i + 1).padStart(2, '0')}
                      </span>
                      {item.tag ? (
                        <>
                          <span aria-hidden className="h-1 w-1 bg-ink-950/20" />
                          <span>{item.tag}</span>
                        </>
                      ) : null}
                    </p>
                    <h3 className="verb mt-3 max-w-[26ch] text-[clamp(1.3rem,2.2vw,1.8rem)] text-ink-950">
                      {item.title}
                    </h3>
                    <p className="mt-3 max-w-[58ch] text-[13px] leading-[1.8] text-ink-500">
                      {item.body}
                    </p>
                  </div>
                  {item.readout?.value ? (
                    <div className="shrink-0 md:w-44 md:pt-1 md:text-right">
                      <p className="num text-[clamp(1.6rem,2.6vw,2.2rem)] leading-none text-accent-600">
                        {item.readout.value}
                      </p>
                      {item.readout.valueLabel ? (
                        <p className="mt-2 font-mono text-[9.5px] capitalize leading-relaxed tracking-[0.14em] text-ink-500">
                          {item.readout.valueLabel}
                        </p>
                      ) : null}
                      {item.readout.caption ? (
                        <p className="mt-1 font-mono text-[9.5px] capitalize leading-relaxed tracking-[0.14em] text-ink-400">
                          {item.readout.caption}
                        </p>
                      ) : null}
                    </div>
                  ) : null}
                </li>
              ))}
            </ol>
          ) : null}

          {data?.illustrativeNote ? (
            <p data-rise="1" className="label label--plain mt-10 max-w-[70ch] leading-[1.9] text-ink-500">
              {data.illustrativeNote}
            </p>
          ) : null}
        </GsapReveal>
      </div>
    </section>
  );
}
