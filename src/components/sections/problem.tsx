import { MdiIcon } from '@/lib/icons/resolve-icon';
import { SheetBlock, SheetTitle } from '@/components/layout/sheet-block';
import { Impression, Reveal, RuleDraw } from '@/lib/motion/reveal';
import { useChrome } from '@/lib/content/chrome';
import type { ProblemSection } from '@/lib/content/types';

/**
 * Problem — where the money actually went.
 *
 * The argument gets one chart: a single full-width bar split into attributed,
 * wasted and unknown, hatched the way a press hatches a loss, with a printed
 * axis beneath it and the headline waste figure set above at display scale.
 * The copy sits in the wide column beside it; the closing line is stamped.
 */

const FILLS = ['bg-ink-950', 'hatch-wasted', 'hatch-unknown'];
const INK_ON = ['text-paper', 'text-ink-950', 'text-ink-950'];

function widthOf(value: string | undefined, total: number, fallback: number) {
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
    <SheetBlock id="problem" folio="02" head={problem?.eyebrow} tone="b">
      <div className="grid gap-x-12 gap-y-14 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)]">
        {/* ---- the argument ---------------------------------------- */}
        <div>
          <SheetTitle lines={problem?.headline ?? ''} delay={0.1} />
          <RuleDraw className="mt-8" delay={0.32}>
            <div className="h-px w-full bg-ink-950/20" />
          </RuleDraw>

          <div className="mt-8 space-y-6">
            {problem?.paragraphs?.map((paragraph, i) => (
              <Reveal key={i} delay={0.16 + i * 0.08}>
                <p className="body-copy">{paragraph}</p>
              </Reveal>
            ))}
          </div>

          {problem?.closing ? (
            <Reveal delay={0.36}>
              <p className="mt-9 inline-flex items-center gap-2.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-500 text-paper">
                  <MdiIcon name="check" size={0.6} />
                </span>
                <span className="w-narrow text-[13px] font-bold uppercase tracking-[0.12em] text-ink-900">
                  {problem.closing}
                </span>
              </p>
            </Reveal>
          ) : null}
        </div>

        {/* ---- the chart -------------------------------------------- */}
        <div className="lg:pt-3">
          <div className="flex items-baseline justify-between gap-6">
            <p className="sheet-head">{problem?.panelTitle ?? 'Account snapshot'}</p>
            <p className="folio w-narrow">{chrome.everyHundred}</p>
          </div>

          {/* the headline figure */}
          <Impression delay={0.24} distance={5}>
            <p className="figure mt-5 text-[clamp(2.6rem,5.4vw,4.2rem)] text-accent-600">
              {problem?.panelAlert ?? 'Wasting −38%'}
            </p>
          </Impression>

          {/* the bar */}
          <Impression delay={0.3} distance={5}>
            <div className="mt-6 flex h-[92px] w-full overflow-hidden border border-ink-950/25">
              {chips.map((chip, i) => {
                const share = widthOf(chip.value, total, 100 / chips.length);
                return (
                  <div
                    key={`${chip.label}-${i}`}
                    className={`relative flex items-end justify-center pb-2.5 ${FILLS[i % FILLS.length]} ${
                      i > 0 ? 'border-l border-paper/60' : ''
                    }`}
                    style={{ width: `${share}%` }}
                  >
                    <span
                      className={`figure tnum text-[13px] ${INK_ON[i % INK_ON.length]}`}
                    >
                      {chip.value}
                    </span>
                  </div>
                );
              })}
            </div>
          </Impression>

          {/* printed axis */}
          <div aria-hidden className="mt-1.5 flex justify-between">
            {Array.from({ length: 11 }).map((_, i) => (
              <span key={i} className="flex w-0 flex-1 flex-col items-start">
                <span className="h-1.5 w-px bg-ink-950/30" />
                <span className="folio w-narrow mt-1 text-[9.5px] text-ink-400">
                  {i * 10}
                  {i === 10 ? '%' : ''}
                </span>
              </span>
            ))}
          </div>

          {/* legend */}
          <dl className="mt-7 grid gap-x-8 gap-y-4 sm:grid-cols-3">
            {chips.map((chip, i) => (
              <div key={`${chip.label}-${i}`} className="border-t border-ink-950/15 pt-3">
                <dt className="flex items-center gap-2.5">
                  <span
                    aria-hidden
                    className={`inline-block h-3 w-3 shrink-0 border border-ink-950/30 ${FILLS[i % FILLS.length]}`}
                  />
                  <span className="w-narrow text-[11.5px] font-semibold uppercase tracking-[0.1em] text-ink-700">
                    {chip.label}
                  </span>
                </dt>
                <dd className="figure mt-2 text-[22px] text-ink-950">{chip.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </SheetBlock>
  );
}
