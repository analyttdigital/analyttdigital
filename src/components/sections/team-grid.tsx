import { InViewTitle } from '@/components/ui/in-view-title';
import { DynamicImage } from '@/components/media/dynamic-image';
import { MdiIcon } from '@/lib/icons/resolve-icon';
import { GsapReveal } from '@/lib/motion/gsap-reveal';
import type { DataProps, TeamGridSection } from '@/lib/content/types';

/**
 * TeamGrid — the people behind the position.
 *
 * Tilt-free plates on paper: photo (or initial tile fallback) above the
 * name, role in mono, one bio. Positional ring alternates; copy stays in
 * the content layer.
 */
export function TeamGrid({ data, classes, className, id }: DataProps<TeamGridSection, 'grid' | 'card'>) {
  const members = data?.members ?? [];
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
            className={['mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3', classes?.grid, className]
              .filter(Boolean)
              .join(' ')}
          >
            {members.map((member, i) => (
              <li key={`${member.name}-${i}`} data-rise={Math.min(i + 1, 3)} className="h-full">
                <article
                  className={[
                    'flex h-full flex-col overflow-hidden rounded-3xl bg-paper-50 ring-1 ring-ink-950/10',
                    classes?.card,
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden">
                    {member.image?.src?.trim() ? (
                      <DynamicImage image={member.image} sizes="480px" className="h-full w-full object-cover" />
                    ) : (
                      <div
                        aria-hidden
                        className="flex h-full w-full items-center justify-center bg-primary-100"
                      >
                        <span className="font-display text-[clamp(2.4rem,4vw,3.4rem)] font-bold text-primary-400">
                          {member.name?.charAt(0) ?? '?'}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="flex items-center gap-2 font-mono text-[10px] capitalize  text-ink-400">
                      <MdiIcon name={member.icon || 'asterisk'} size={0.7} />
                      {member.role}
                    </p>
                    <h3 className="verb mt-3 text-[clamp(1.2rem,1.9vw,1.5rem)] text-ink-950">
                      {member.name}
                    </h3>
                    <p className="mt-3 text-[12.5px] leading-[1.8] text-ink-500">{member.body}</p>
                  </div>
                </article>
              </li>
            ))}
          </ol>
        </GsapReveal>
      </div>
    </section>
  );
}
