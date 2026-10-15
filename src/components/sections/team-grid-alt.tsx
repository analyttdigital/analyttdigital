import { InViewTitle } from '@/components/graphics/in-view-title';
import { DynamicImage } from '@/components/media/dynamic-image';
import { MdiIcon } from '@/lib/icons/resolve-icon';
import { GsapReveal } from '@/lib/motion/gsap-reveal';
import type { DataProps, TeamGridSection } from '@/lib/content/types';

/**
 * TeamGridAlt — the people as horizontal ledger rows.
 *
 * Where `TeamGrid` sets photo-top plates in a grid, the alt lists each
 * member as a full-width row: avatar left (photo, or the initial tile on
 * the positional tint), name + mono role + bio right, hairline dividers.
 * Same fields, no new copy.
 */
export function TeamGridAlt({ data, classes, className, id }: DataProps<TeamGridSection, 'rows' | 'row'>) {
  const members = data?.members ?? [];
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
          {members.length > 0 ? (
            <ol
              className={['mt-12 border-t border-ink-950/10', classes?.rows]
                .filter(Boolean)
                .join(' ')}
            >
              {members.map((member, i) => (
                <li
                  key={`${member.name}-${i}`}
                  data-rise={Math.min(i + 1, 3)}
                  className={`flex flex-col gap-5 border-b border-ink-950/10 py-8 sm:flex-row sm:items-start sm:gap-8 ${classes?.row ?? ''}`}
                >
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-primary-100">
                    {member.image?.src?.trim() ? (
                      <DynamicImage image={member.image} sizes="160px" className="absolute inset-0 h-full w-full object-cover" />
                    ) : (
                      <span aria-hidden className="grid h-full w-full place-items-center font-display text-3xl font-bold text-primary-400">
                        {member.name?.charAt(0) ?? '?'}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 font-mono text-[10px] capitalize text-ink-400">
                      <MdiIcon name={member.icon || 'asterisk'} size={0.7} />
                      {member.role}
                    </p>
                    <h3 className="verb mt-2 text-[clamp(1.2rem,1.9vw,1.5rem)] text-ink-950">
                      {member.name}
                    </h3>
                    <p className="mt-2 max-w-[68ch] text-[12.5px] leading-[1.8] text-ink-500">
                      {member.body}
                    </p>
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
