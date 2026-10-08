import { Belief } from '@/components/sections/belief';
import { Capabilities } from '@/components/sections/capabilities';
import { Cta } from '@/components/sections/cta';
import { Hero } from '@/components/sections/hero';
import { Industries } from '@/components/sections/industries';
import { Insights } from '@/components/sections/insights';
import { Problem } from '@/components/sections/problem';
import { ProcessChapter } from '@/components/sections/process-chapter';
import { Stats } from '@/components/sections/stats';
import { Work } from '@/components/sections/work';
import type { Section } from '@/lib/content/types';
import PathFlowSection from '../graphics/path-flow-section';

/** Render a page document's ordered section list. */
export function SectionRenderer({ sections }: { sections: Section[] }) {
  return (
    <>
      {sections.map((section, i) => (
        <SectionBlock key={`${section.type}-${i}`} section={section} sections={sections} />
      ))}
    </>
  );
}

function SectionBlock({ section, sections }: { section: Section; sections: Section[] }) {
  switch (section.type) {
    case 'hero': {
      // The portal flood carries the next ground's own words: bridge copy is
      // read from the Process section's content layer, never hard-coded.
      const proc = sections.find((s) => s.type === 'process');
      const bridge =
			proc && proc.type === "process"
				? {
						eyebrow: proc.eyebrow,
						headline: `${proc.headline} ${proc.headlineAccent}`.trim(),
						lede: proc.lede,
					}
				: undefined;
      return <Hero hero={section} bridge={bridge} />;
    }
    case 'problem':
      return <Problem problem={section} />;
    case 'belief':
      return <Belief belief={section} />;
    case 'process':
          return (
				<div className="relative w-full flex flex-col">
					{/* <div className="h-screen z-0 pointer-events-none">
						<PathFlowSection
							// variant="staircase-ltr" // "staircase-ltr" | "staircase-rtl" | "edges-converge" | "cross-flow"
							variant="staircase-ltr"
							mode="scroll" // or "auto"
							trailColor="#2563eb"
							
                            header={<h2>…</h2>}
                            contentClassName="h-screen"
						>
							<div className="bg-accent p-4 h-full rounded-lg" />
							<div className="bg-accent p-4 h-full rounded-lg" />
						</PathFlowSection>
					</div> */}

					<ProcessChapter process={section} />
				</div>
			);
    case 'capabilities':
      return <Capabilities capabilities={section} />;
    case 'work':
      return <Work work={section} />;
    case 'stats':
      return <Stats stats={section} />;
    case 'industries':
      return <Industries industries={section} />;
    case 'insights':
      return <Insights insights={section} />;
    case 'cta':
      return <Cta cta={section} />;
    default:
      return null;
  }
}
