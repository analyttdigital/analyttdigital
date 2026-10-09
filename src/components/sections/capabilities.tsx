import { Band } from '@/components/layout/band';
import { InViewTitle } from '@/components/graphics/in-view-title';
import { GsapReveal, TiltCard } from '@/lib/motion/gsap-reveal';
import { MdiIcon, capabilityIcons } from '@/lib/icons/resolve-icon';
import type { CapabilitiesSection } from '@/lib/content/types';

/**
 * Capabilities — four services as soft tilt plates on the light band.
 *
 * The sharp-corner system is retired here: each service is a rounded paper
 * plate with a soft shadow and an ember spotlight that follows the pointer,
 * the plate itself leaning into the cursor (TiltCard, GSAP). Entrances are
 * GSAP rise + de-blur on scroll (GsapReveal). Ember stays semantic — the
 * icon tile and the live tag. Content shape unchanged: tag / depth / title
 * / body / icon per item.
 */

const SHADOW = 'shadow-[0_24px_60px_-28px_rgb(var(--color-primary-600)/0.3)]';

export function Capabilities({ capabilities }: { capabilities?: CapabilitiesSection }) {
  const items = capabilities?.items ?? [];

  return (
    <Band id="capabilities" ground="paper">
      <GsapReveal>
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div data-rise>
            <p className="label text-ink-500">{capabilities?.eyebrow ?? 'Our services'}</p>
            <InViewTitle
              text={(capabilities?.headline ?? '').replace(/\n/g, ' ')}
              variant="blur"
              as="h2"
              className="title mt-6 max-w-[18ch] text-[clamp(2rem,4vw,2.6rem)] text-ink-950"
            />
          </div>
          <p data-rise="1" className="max-w-[38ch] text-sm leading-relaxed text-ink-500">
            Four things we are hired for, and the order they happen in.
          </p>
        </div>

        <ol className="mt-12 grid gap-6 md:grid-cols-2">
          {items.map((item, i) => (
            <li key={item.title} data-rise={i + 1}>
              <TiltCard className={`h-full rounded-3xl bg-paper-50 ${SHADOW}`} max={5}>
                <article
                  aria-label={`${item.depth ?? String(i + 1).padStart(2, '0')} — ${item.title}`}
                  className="flex h-full flex-col rounded-3xl border border-ink-950/[0.07] p-7 md:p-8"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-accent-500/10 text-accent-600">
                      <MdiIcon name={item.icon || capabilityIcons[i % capabilityIcons.length]} size={0.95} />
                    </span>
                    <span className="font-mono text-[10.5px] font-medium uppercase tracking-[0.16em] text-ink-400">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="ml-auto inline-flex items-center gap-2 rounded-full border border-accent-600/30 bg-accent-500/[0.07] px-3.5 py-1.5 font-mono text-[9.5px] font-medium uppercase tracking-[0.14em] text-accent-600">
                      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent-500" />
                      {item.tag}
                    </span>
                  </div>
                  <h3 className="verb mt-6 max-w-[24ch] text-[clamp(1.35rem,2.3vw,1.8rem)] text-ink-950">
                    {item.title}
                  </h3>
                  <p className="mt-3 max-w-[56ch] text-[13.5px] leading-[1.75] text-ink-500">{item.body}</p>
                  <p className="mt-auto flex items-center gap-2 pt-6 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-ink-400">
                    <MdiIcon name={item.icon || capabilityIcons[i % capabilityIcons.length]} size={0.7} />
                    {item.depth ?? `Grade ${String(i + 1).padStart(2, '0')}`}
                  </p>
                </article>
              </TiltCard>
            </li>
          ))}
        </ol>
      </GsapReveal>
    </Band>
  );
}
