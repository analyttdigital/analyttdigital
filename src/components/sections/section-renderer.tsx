import { ScrollSection } from '@/components/blocks/scroll-section';
import { AboutSection } from '@/components/sections/about';
import { Belief } from '@/components/sections/belief';
import { Capabilities } from '@/components/sections/capabilities';
import { Cta } from '@/components/sections/cta';
import { CtaBanner } from '@/components/sections/cta-banner';
import { CtaSplit } from '@/components/sections/cta-split';
import { HeroStage } from '@/components/sections/hero';
import { Industries } from '@/components/sections/industries';
import { Insights } from '@/components/sections/insights';
import { Problem } from '@/components/sections/problem';
import { ProcessChapter, ProcessClosing } from '@/components/sections/process-chapter';
import { Stats } from '@/components/sections/stats';
import { Work } from '@/components/sections/work';
import type { Section } from '@/lib/content/types';
import type { AboutSection as AboutContent, } from "@/lib/content/types";
import {
  PORTAL_BRIDGE_RANGE,
  PORTAL_ORIGIN,
  PORTAL_ORIGIN_MOBILE,
  PORTAL_RANGE,
  PORTAL_RUNWAY_SVH,
} from '@/lib/motion/portal';

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
      // The portal flood carries the full About section as bridge copy;
      // the circle finishes before the process cover starts. Absent =
      // the hero renders as a plain static stage and the portal is skipped.
      const about: ({ type: "about" } & AboutContent) | undefined = sections.find(
			(s) => s.type === "about"
		);
      return about ? (
			<ScrollSection
				variant="portal"
				runway={PORTAL_RUNWAY_SVH}
				range={PORTAL_RANGE} // circle finishes before the cover starts
				bridgeRange={PORTAL_BRIDGE_RANGE}
				origin={PORTAL_ORIGIN}
				originMobile={PORTAL_ORIGIN_MOBILE}
				floodClassName="bg-primary"
				bridge={<AboutSection data={about} compact />}
				id="hero"
			>
				{(p) => <HeroStage hero={section} progress={p} />}
			</ScrollSection>
		) : (
			<section id="hero">
				<HeroStage hero={section} />
			</section>
		);
    }
    // Consumed as the hero portal's bridge copy above — never rendered standalone.
    case 'about':
      return null;
    case 'problem':
      return (
				<Problem data={section} />
		);
    case 'belief':
      return (
        <ScrollSection variant="fade-up">
          <Belief data={section} />
        </ScrollSection>
      );
    case 'process': {
        // The shrink exit starts after the last step has had dwell: steps
        // sweep the runway uniformly, so the last of `n` steps goes active
        // at (n-1)/n — the exit opens half a step-window later.
        const n = Math.max(section.steps?.length ?? 1, 1);
        const exitStart = 1 - 0.5 / n;
        return (
				<>
					<ScrollSection
						id="process"
						variant="shrink"
						runway={200}
						range={[exitStart, 1]}
						// The cover trick: pulled up over the hero's held flood on an
						// opaque ground (`bg-background` is not a theme token, so the
						// process ground `bg-paper` stands in).
						className="relative z-10 -mt-[100svh] bg-paper"
						snap="magnetic"
					>
						{(p) => <ProcessChapter process={section} progress={p} />}
					</ScrollSection>
					<ScrollSection variant="fade-up">
						<ProcessClosing process={section} />
					</ScrollSection>
				</>
			);
    }
    case 'capabilities':
      return (
        <ScrollSection variant="tilt-up">
          <Capabilities capabilities={section} />
        </ScrollSection>
      );
    case 'work':
      return (
        <ScrollSection variant="window-open">
          <Work data={section} />
        </ScrollSection>
      );
    case 'stats':
      return (
        <ScrollSection variant="scale-in">
          <Stats data={section} />
        </ScrollSection>
      );
    case 'industries':
      return (
        <ScrollSection variant="fade-up">
          <Industries data={section} />
        </ScrollSection>
      );
    case 'insights':
      return (
        <ScrollSection variant="mask-up">
          <Insights insights={section} />
        </ScrollSection>
      );
    case 'cta':
      return (
          <Cta cta={section} />
      );
    case 'cta-banner':
      return (
			<ScrollSection variant="zoom-settle">
				<CtaBanner data={section} />
			</ScrollSection>
		);
    case 'cta-split':
      return (
			<ScrollSection variant="zoom-settle">
				<CtaSplit data={section} />
			</ScrollSection>
		);
    default:
      return null;
  }
}
