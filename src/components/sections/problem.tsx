import { Band, BandHead, BandTitle, DEEP, FIELD } from '@/components/layout/band';
import { PanelIn, Reveal } from '@/lib/motion/reveal';
import { useChrome } from '@/lib/content/chrome';
import type { ProblemSection } from '@/lib/content/types';

/**
 * Problem — where the money actually went.
 *
 * The argument gets one chart, and the chart is made of the page's own
 * material: every hundred shillings of spend is a column of squares, and the
 * column that is losing money is ember. The measure is chosen so the reader
 * can count the squares instead of trusting a percentage, which is the whole
 * argument of this agency in one glyph.
 *
 * This is the second resolve on the page and the deepest one: the field the
 * reader has been reading on drops away beneath them, on the coarse pixel
 * grid, and the net re-routes itself from the argument across to the chart
 * that proves it.
 */

const STACK = 16;
const FILL = ['bg-primary-200', 'bg-accent-500', 'bg-primary-50/25'];

/** Argument on the left, instrument on the right, and the gutter between
 *  them where the routes cross over to the chart that proves the claim. */
const NODES = [
  { x: 0.0, y: 0.37 },
  { x: 0.19, y: 0.48 },
  { x: 0.0, y: 0.66 },
  { x: 0.49, y: 0.37 },
  { x: 0.49, y: 0.8 },
];

function shareOf(value: string | undefined, total: number, fallback: number) {
  const parsed = Number.parseFloat((value ?? '').replace(/[^\d.]/g, ''));
  if (Number.isNaN(parsed) || total <= 0) return fallback;
  return (parsed / total) * 100;
}

export function Problem({ problem }: { problem?: ProblemSection }) {
  const chrome = useChrome();
  const chips = problem?.panelChips ?? [];
  const total = chips.reduce((sum, chip) => {
    const parsed = Number.parseFloat(chip.value.replace(/[^\d.]/g, ''));
    return sum + (Number.isNaN(parsed) ? 0 : parsed);
  }, 0);

  return (
    <Band
      id="problem"
      ground="deep"
      resolve={{ from: FIELD, to: DEEP, height: 236, cell: 21 }}
      mesh={{ seed: 12, count: 5, depth: 40, opacity: 0.58, anchors: NODES }}
    >
      <div className="grid gap-x-14 gap-y-14 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)]">
        {/* ---- the argument ---------------------------------------- */}
        <div>
          <BandHead>{problem?.eyebrow}</BandHead>
          <BandTitle lines={problem?.headline ?? ''} className="mt-9 max-w-[16ch]" />

          <div className="mt-9 space-y-6">
            {problem?.paragraphs?.map((paragraph, i) => (
              <Reveal key={i} delay={0.14 + i * 0.08}>
                <p className="body max-w-[60ch]">{paragraph}</p>
              </Reveal>
            ))}
          </div>

          {problem?.closing ? (
            <Reveal delay={0.36}>
              <p className="label label--bright mt-9">{problem.closing}</p>
            </Reveal>
          ) : null}
        </div>

        {/* ---- the chart, in squares -------------------------------- */}
        <PanelIn from="bottom" distance={4} delay={0.16}>
          <div className="panel--deep h-full p-7 md:p-9">
            <div className="flex items-start justify-between gap-6">
              <p className="label">{problem?.panelTitle ?? 'Account snapshot'}</p>
              <p className="label">{chrome.everyHundred}</p>
            </div>

            <p className="num mt-7 text-[clamp(2.4rem,5vw,3.8rem)] text-accent-500">
              {problem?.panelAlert ?? 'Wasting −38%'}
            </p>

            <div className="mt-9 flex items-end gap-5 border-b border-primary-50/16 pb-5">
              {chips.map((chip, i) => {
                const share = shareOf(chip.value, total, 100 / chips.length);
                const squares = Math.max(1, Math.round((share / 100) * STACK));
                return (
                  <div key={`${chip.label}-${i}`} className="flex flex-1 flex-col items-start gap-3">
                    <div className="flex w-full flex-col-reverse gap-[3px]">
                      {Array.from({ length: squares }).map((_, s) => (
                        <span
                          key={s}
                          aria-hidden
                          className={`block aspect-square w-[15px] animate-settle ${FILL[i % FILL.length]}`}
                          style={{ animationDelay: `${i * 90 + s * 45}ms` }}
                        />
                      ))}
                    </div>
                    <span className="num text-[17px] text-primary-50">{chip.value}</span>
                  </div>
                );
              })}
            </div>

            <ul className="mt-7 flex flex-wrap gap-x-8 gap-y-4">
              {chips.map((chip, i) => (
                <li key={`${chip.label}-${i}`}>
                  <span className="label">
                    <span
                      aria-hidden
                      className={`mr-2.5 inline-block h-2.5 w-2.5 align-middle ${FILL[i % FILL.length]}`}
                    />
                    {chip.label}
                  </span>
                </li>
              ))}
            </ul>

            <p className="mt-8 border-t border-primary-50/12 pt-4 text-[12px] leading-relaxed text-primary-400">
              {chrome.illustration}
            </p>
          </div>
        </PanelIn>
      </div>
    </Band>
  );
}