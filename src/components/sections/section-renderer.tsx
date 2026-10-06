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
        <SectionBlock key={`${section.type}-${i}`} section={section} />
      ))}
    </>
  );
}

function SectionBlock({ section }: { section: Section }) {
  switch (section.type) {
    case 'hero':
      return <Hero hero={section} />;
    case 'problem':
      return <Problem problem={section} />;
    case 'belief':
      return <Belief belief={section} />;
    case 'process':
          return (
				<div className="relative w-full flex flex-col">
					<PathFlowSection
						// variant="staircase-ltr" // "staircase-ltr" | "staircase-rtl" | "edges-converge" | "cross-flow"
						variant="cross-flow"
						mode="scroll" // or "auto"
						trailColor="#2563eb"
						header={<h2>…</h2>}
					>
						<div className="bg-accent p-4 h-full rounded-lg" />
						<div className="bg-accent p-4 h-full rounded-lg" />
						<div className="bg-accent p-4 h-full rounded-lg" />
						{/* child N goes in slot N of the variant */}
					</PathFlowSection>
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
