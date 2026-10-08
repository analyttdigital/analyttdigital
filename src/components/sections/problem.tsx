import { Band } from '@/components/layout/band';
import { InViewTitle } from '@/components/graphics/in-view-title';
import { NodeIn, Reveal } from '@/lib/motion/reveal';
import { useChrome } from '@/lib/content/chrome';
import type { ProblemSection } from '@/lib/content/types';

/**
 * Problem — where the money actually went, as Otto's "trust" split.
 *
 * The descent into the argument takes the deep band: the charge on the left
 * (mono eyebrow, blurred display statement, paragraphs, and the losing
 * figure in ember), the evidence on the right as a ruled list — one hairline
 * row per spend split with its marker, label, countable debit squares and
 * share, the way Otto's trust rows carry one proof each. Rows tint on hover
 * and their figure warms to ember. Sitting on primary-950, this is the
 * ground the belief's resolve dissolves out of. Content shape untouched.
 */

const STACK = 16;
const FILL = ['bg-primary-50/25', 'bg-accent-500', 'bg-primary-50/10'];

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
    <Band id="problem" ground="deep">
      <div className="grid gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        {/* ---- the charge ---------------------------------------- */}
        <div>
          <p className="label text-paper/60">{problem?.eyebrow}</p>
          <InViewTitle
            text={(problem?.headline ?? '').replace(/\n/g, ' ')}
            variant="blur"
            as="h2"
            className="title mt-6 max-w-[14ch] text-[clamp(2.1rem,4.4vw,3rem)] text-paper"
          />
          <div className="mt-7 space-y-5">
            {problem?.paragraphs?.map((paragraph, i) => (
              <Reveal key={i} delay={0.12 + i * 0.08}>
                <p className="max-w-[52ch] text-[13px] leading-[1.85] text-paper/60">{paragraph}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.3}>
            <div className="mt-10 border-t border-paper-50/15 pt-7">
              <p className="num text-[clamp(2.6rem,5.4vw,4.2rem)] leading-none text-accent-400">
                {problem?.panelAlert ?? 'Wasting −38%'}
              </p>
              <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-[0.16em] text-paper/40">
                <span>{problem?.panelTitle ?? 'Account snapshot'}</span>
                <span aria-hidden className="h-1 w-1 bg-accent-500" />
                <span>{chrome.everyHundred}</span>
              </p>
            </div>
          </Reveal>
          {problem?.closing ? (
            <Reveal delay={0.4}>
              <p className="label mt-8 text-accent-300">{problem.closing}</p>
            </Reveal>
          ) : null}
        </div>

        {/* ---- the evidence — one ruled row per spend split -------- */}
        <ol className="border-t border-paper-50/15">
          {chips.map((chip, i) => {
            const share = shareOf(chip.value, total, 100 / Math.max(chips.length, 1));
            const squares = Math.max(1, Math.round((share / 100) * STACK));
            return (
              <NodeIn as="li" key={`${chip.label}-${i}`} delay={0.08 + i * 0.07}>
                <div className="group grid grid-cols-[2.2rem_minmax(0,1fr)_auto] items-start gap-x-5 border-b border-paper-50/15 px-2 py-6 transition-colors duration-300 hover:bg-paper-50/5">
                  <span className="pt-1 font-mono text-[10px] tracking-[0.14em] text-paper/40">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span>
                    <span className="block text-[15px] font-medium tracking-tight text-paper">{chip.label}</span>
                    <span aria-hidden className="mt-3 flex flex-wrap gap-[3px]">
                      {Array.from({ length: squares }).map((_, s) => (
                        <span
                          key={s}
                          className={`block h-[11px] w-[11px] transition-transform duration-300 group-hover:scale-110 ${FILL[i % FILL.length]}`}
                        />
                      ))}
                    </span>
                  </span>
                  <span className="text-right">
                    <span className="block font-display text-[19px] font-medium tracking-tight text-paper transition-colors duration-300 group-hover:text-accent-400">
                      {chip.value}
                    </span>
                    <span className="mt-1 block font-mono text-[10px] tracking-[0.16em] text-paper/40">
                      {Math.round(share)}%
                    </span>
                  </span>
                </div>
              </NodeIn>
            );
          })}
          <li className="flex flex-wrap gap-2.5 pt-6">
            {chips.map((chip, i) => (
              <span
                key={`${chip.label}-${i}`}
                className="inline-flex items-center gap-2 rounded-full border border-paper-50/15 px-3.5 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.14em] text-paper/60"
              >
                <span aria-hidden className={`h-1.5 w-1.5 ${FILL[i % FILL.length]}`} />
                {chip.label}
              </span>
            ))}
          </li>
          <li className="pt-5 text-[11px] leading-relaxed text-paper/35">{chrome.illustration}</li>
        </ol>
      </div>
    </Band>
  );
}
