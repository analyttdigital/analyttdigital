import { Band, BandHead, BandTitle } from '@/components/layout/band';
import { NodeIn } from '@/lib/motion/reveal';
import type { IndustriesSection } from '@/lib/content/types';

/**
 * Industries — the sector index.
 *
 * Back matter, printed as back matter: a short index of sectors set as chips
 * on the field, because in this world a chip is how state gets marked and an
 * index is a list of things the agency has already worked in. No leaders,
 * because there are no page numbers to point at. The ground change above it
 * crosses on a seam rather than dissolving — the resolve is spent.
 */
export function Industries({ industries }: { industries?: IndustriesSection }) {
  const items = industries?.items ?? [];

  return (
    <Band id="industries" ground="field">
      <div className="grid gap-x-14 gap-y-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-end">
        <div>
          <BandHead>{industries?.eyebrow}</BandHead>
          <BandTitle lines={industries?.headline ?? ''} className="mt-9 max-w-[14ch]" />
        </div>
        <div>
          {industries?.body ? <p className="body max-w-[50ch] text-primary-200">{industries.body}</p> : null}
          {industries?.hint ? <p className="label mt-5">{industries.hint}</p> : null}
        </div>
      </div>

      <ul className="mt-14 flex flex-wrap gap-2.5">
        {items.map((item, i) => (
          <NodeIn as="li" key={item} delay={0.02 + i * 0.03}>
            <span className="chip cursor-default py-2.5 text-[11px]">{item}</span>
          </NodeIn>
        ))}
      </ul>
    </Band>
  );
}