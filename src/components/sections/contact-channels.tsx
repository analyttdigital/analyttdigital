import { InViewTitle } from '@/components/ui/in-view-title';
import { MdiIcon } from '@/lib/icons/resolve-icon';
import { GsapReveal } from '@/lib/motion/gsap-reveal';
import type { ContactChannelsSection, DataProps } from '@/lib/content/types';

/**
 * ContactChannels — the three ways to reach the team.
 *
 * Ledger rows on a paper-50 panel: icon chip, label + value, mono note.
 * Whole row links (tel:/mailto:/URL from content).
 */
export function ContactChannels({
  data,
  classes,
  className,
  id,
}: DataProps<ContactChannelsSection, 'panel'>) {
  const channels = data?.channels ?? [];
  return (
    <section id={id} className="relative overflow-hidden bg-paper py-24 md:py-32">
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
          <ol
            className={[
              'mt-12 grid gap-6 rounded-[2rem] bg-paper-50 p-7 ring-1 ring-ink-950/10 md:grid-cols-3 md:p-10',
              classes?.panel,
              className,
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {channels.map((channel, i) => (
              <li key={`${channel.label}-${i}`} data-rise={Math.min(i + 1, 3)}>
                <a href={channel.href} className="group flex h-full flex-col gap-4">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-ink-950 text-paper-50 transition-colors duration-200 group-hover:bg-primary-700">
                    <MdiIcon name={channel.icon || 'asterisk'} size={0.9} />
                  </span>
                  <span>
                    <span className="block font-mono text-[10px] capitalize  text-ink-400">
                      {channel.label}
                    </span>
                    <span className="verb mt-2 block text-[clamp(1.1rem,1.8vw,1.4rem)] text-ink-950 transition-colors duration-200 group-hover:text-accent-600">
                      {channel.value}
                    </span>
                  </span>
                  {channel.note ? (
                    <span className="mt-auto block text-[12.5px] leading-[1.8] text-ink-500">
                      {channel.note}
                    </span>
                  ) : null}
                </a>
              </li>
            ))}
          </ol>
        </GsapReveal>
      </div>
    </section>
  );
}
