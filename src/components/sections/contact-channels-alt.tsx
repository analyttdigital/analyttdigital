import { InViewTitle } from '@/components/ui/in-view-title';
import { MdiIcon } from '@/lib/icons/resolve-icon';
import { GsapReveal } from '@/lib/motion/gsap-reveal';
import type { ContactChannelsSection, DataProps } from '@/lib/content/types';

/**
 * ContactChannelsAlt — the ways to reach the team as ruled rows.
 *
 * Where `ContactChannels` sets the channels as cards on a panel grid, the
 * alt is a full-width ledger: icon chip, label + value inline, mono note
 * right, travel arrow. Whole row links (tel:/mailto:/URL from content).
 * Same fields, no new copy.
 */
export function ContactChannelsAlt({
  data,
  classes,
  className,
  id,
}: DataProps<ContactChannelsSection, 'rows'>) {
  const channels = data?.channels ?? [];
  return (
    <section id={id} className={`relative overflow-hidden bg-paper py-24 md:py-32 ${className ?? ''}`}>
      <div className="relative mx-auto w-full max-w-7xl px-5 md:px-8">
        <GsapReveal>
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div data-rise>
              <p className="label text-ink-500">{data?.eyebrow}</p>
              <InViewTitle
                text={(data?.headline ?? '').replace(/\n/g, ' ')}
                variant="blur"
                as="h2"
                className="title mt-7 max-w-[16ch] text-[clamp(2rem,4vw,2.8rem)] text-ink-950"
              />
            </div>
            {data?.body ? (
              <p data-rise="1" className="max-w-[52ch] text-sm leading-[1.85] text-ink-500">
                {data.body}
              </p>
            ) : null}
          </div>
          {channels.length > 0 ? (
            <ol
              className={['mt-12 border-t border-ink-950/10', classes?.rows]
                .filter(Boolean)
                .join(' ')}
            >
              {channels.map((channel, i) => (
                <li key={`${channel.label}-${i}`} data-rise={Math.min(i + 1, 3)} className="border-b border-ink-950/10">
                  <a
                    href={channel.href}
                    className="group grid items-center gap-4 py-6 sm:grid-cols-[auto_minmax(0,1fr)_auto_auto] sm:gap-8"
                  >
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-ink-950 text-paper-50 transition-colors duration-200 group-hover:bg-primary-700">
                      <MdiIcon name={channel.icon || 'asterisk'} size={0.9} />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-mono text-[10px] capitalize text-ink-400">
                        {channel.label}
                      </span>
                      <span className="verb mt-1 block truncate text-[clamp(1.1rem,2vw,1.5rem)] text-ink-950 transition-colors duration-200 group-hover:text-accent-600">
                        {channel.value}
                      </span>
                    </span>
                    {channel.note ? (
                      <span className="hidden max-w-[32ch] text-[12.5px] leading-[1.8] text-ink-500 md:block">
                        {channel.note}
                      </span>
                    ) : null}
                    <MdiIcon
                      name="arrowTopRight"
                      size={0.9}
                      className="hidden text-ink-300 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-500 sm:block"
                    />
                  </a>
                </li>
              ))}
            </ol>
          ) : null}
        </GsapReveal>
      </div>
    </section>
  );
}
