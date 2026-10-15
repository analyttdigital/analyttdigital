import { ScrollSection } from '@/components/blocks/scroll-section';
import { AboutSection } from '@/components/sections/about';
import { Belief } from '@/components/sections/belief';
import { BeliefAlt } from '@/components/sections/belief-alt';
import { Capabilities } from '@/components/sections/capabilities';
import { CapabilitiesAlt } from '@/components/sections/capabilities-alt';
import { CompareTable } from '@/components/sections/compare-table';
import { CompareTableAlt } from '@/components/sections/compare-table-alt';
import { ContactChannels } from '@/components/sections/contact-channels';
import { ContactChannelsAlt } from '@/components/sections/contact-channels-alt';
import { Cta } from '@/components/sections/cta';
import { CtaAlt } from '@/components/sections/cta-alt';
import { CtaSplit } from '@/components/sections/cta-split';
import { Exclusions } from '@/components/sections/exclusions';
import { ExclusionsAlt } from '@/components/sections/exclusions-alt';
import { Faq } from '@/components/sections/faq';
import { FaqAlt } from '@/components/sections/faq-alt';
import { FormShell } from '@/components/sections/form-shell';
import { FormShellAlt } from '@/components/sections/form-shell-alt';
import { HeroStage } from '@/components/sections/hero';
import { Industries } from '@/components/sections/industries';
import { IndustriesAlt } from '@/components/sections/industries-alt';
import { Insights } from '@/components/sections/insights';
import { InsightsAlt } from '@/components/sections/insights-alt';
import { PageHero } from '@/components/sections/page-hero';
import { PageHeroAlt } from '@/components/sections/page-hero-alt';
import { PlanPicker } from '@/components/sections/plan-picker';
import { PlanPickerAlt } from '@/components/sections/plan-picker-alt';
import { PricingTiers } from '@/components/sections/pricing-tiers';
import { PricingTiersAlt } from '@/components/sections/pricing-tiers-alt';
import { Problem } from '@/components/sections/problem';
import { ProblemAlt } from '@/components/sections/problem-alt';
import { ProcessChapter, ProcessClosing, ProcessBridge } from '@/components/sections/process-chapter';
import { ProcessAlt } from '@/components/sections/process-alt';
import { Stats } from '@/components/sections/stats';
import { StatsAlt } from '@/components/sections/stats-alt';
import { TeamGrid } from '@/components/sections/team-grid';
import { TeamGridAlt } from '@/components/sections/team-grid-alt';
import { Work } from '@/components/sections/work';
import { WorkAlt } from '@/components/sections/work-alt';
import type { AboutSection as AboutContent, BlogPost, CtaSection, Section } from "@/lib/content/types";
import {
  PORTAL_BRIDGE_RANGE,
  PORTAL_ORIGIN,
  PORTAL_ORIGIN_MOBILE,
  PORTAL_RANGE,
  PORTAL_RUNWAY_SVH,
} from '@/lib/motion/portal';

/** Render a page document's ordered section list. `latestPosts`, when
 *  present, overrides static `insights` articles with the real listing. */
export function SectionRenderer({ sections, latestPosts }: { sections: Section[]; latestPosts?: BlogPost[] }) {
  return (
    <>
      {sections.map((section, i) => (
        <SectionBlock key={`${section.type}-${i}`} section={section} sections={sections} latestPosts={latestPosts} />
      ))}
    </>
  );
}

function withPosts<T extends { type: string }>(section: T, latestPosts?: BlogPost[]): T {
  if ((section.type === 'insights' || section.type === 'insights-alt') && latestPosts?.length) {
    return { ...section, posts: latestPosts.slice(0, 3) };
  }
  return section;
}

function SectionBlock({ section, sections, latestPosts }: { section: Section; sections: Section[]; latestPosts?: BlogPost[] }) {
  switch (section.type) {
		case "hero": {
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
		case "about":
			return null;
		case "problem":
			return <Problem data={section} />;
		case "problem-alt":
			return (
					<ProblemAlt data={section} />
			);
		case "belief":
			return (
					<Belief data={section} />
			);
		case "belief-alt":
			return (
					<BeliefAlt data={section} />
			);
		case "process": {
			// The shrink exit starts after the last step has had dwell: steps
			// sweep the runway uniformly, so the last of `n` steps goes active
			// at (n-1)/n — the exit opens half a step-window later.
			const n = Math.max(section.steps?.length ?? 1, 1);
			const exitStart = 1 - 0.5 / n;
			// The bridge is the page's cta-banner block: consumed here, hidden
			// standalone below — the process `image` is its panel background.
			const banner = sections.find(
				(s): s is { type: "cta-banner" } & CtaSection => s.type === "cta-banner"
			);
			return (
				<>
					<ScrollSection
						id="process"
						variant="shrink"
						runway={200}
						range={[exitStart, 1]}
						// The bridge shares the stage's exit window, so the ask
						// crossfades up as the step card dissolves — the runway
						// resolves onto the CTA, not onto bare paper.
						bridgeRange={[exitStart, 1]}
						bridge={
							banner ? <ProcessBridge process={section} banner={banner} /> : undefined
						}
						// The cover trick: pulled up over the hero's held flood on an
						// opaque ground (`bg-background` is not a theme token, so the
						// process ground `bg-paper` stands in).
						className="relative z-10 -mt-[100svh] bg-paper"
						snap="magnetic"
					>
						{(p) => <ProcessChapter process={section} progress={p} />}
					</ScrollSection>
                    {section.closing && <ScrollSection variant="fade-up">
                        <ProcessClosing process={section} />
                    </ScrollSection>}
				</>
			);
		}
		case "process-alt": {
			return (
					<ProcessAlt data={section} />
			);
		}
		case "capabilities":
			return (
					<Capabilities capabilities={section} />
			);
		case "capabilities-alt":
			return (
					<CapabilitiesAlt data={section} />
			);
		case "work":
			return (
					<Work data={section} />
			);
		case "work-alt":
			return (
					<WorkAlt data={section} />
			);
		case "stats":
			return (
					<Stats data={section} />
			);
		case "stats-alt":
			return (
					<StatsAlt data={section} />
			);
		case "industries":
			return (
					<Industries data={section} />
			);
		case "industries-alt":
			return (
					<IndustriesAlt data={section} />
			);
		case "insights":
			return (
					<Insights insights={withPosts(section, latestPosts)} />
			);
		case "insights-alt":
			return (
					<InsightsAlt data={withPosts(section, latestPosts)} />
			);
		case "cta":
			return <Cta cta={section} />;
		case "cta-alt":
			return (
					<CtaAlt data={section} />
			);
		// Consumed as the process bridge above — never rendered standalone.
		case "cta-banner":
			return null;
		case "cta-split":
			return (
					<CtaSplit data={section} />
			);
		case "page-hero":
			return <PageHero data={section} />;
		case "page-hero-alt":
			return <PageHeroAlt data={section} />;
		case "team-grid":
			return (
					<TeamGrid data={section} />
			);
		case "team-grid-alt":
			return (
					<TeamGridAlt data={section} />
			);
		case "contact-channels":
			return (
					<ContactChannels data={section} />
			);
		case "contact-channels-alt":
			return (
					<ContactChannelsAlt data={section} />
			);
		case "form-shell":
			return (
					<FormShell data={section} />
			);
		case "form-shell-alt":
			return (
					<FormShellAlt data={section} />
			);
		case "faq":
			return (
					<Faq data={section} />
			);
		case "faq-alt":
			return (
					<FaqAlt data={section} />
			);
		case "pricing-tiers":
			return (
					<PricingTiers data={section} />
			);
		case "pricing-tiers-alt":
			return (
					<PricingTiersAlt data={section} />
			);
		case "compare-table":
			return (
					<CompareTable data={section} />
			);
		case "compare-table-alt":
			return (
					<CompareTableAlt data={section} />
			);
		case "exclusions":
			return (
					<Exclusions data={section} />
			);
		case "exclusions-alt":
			return (
					<ExclusionsAlt data={section} />
			);
		case "plan-picker":
			return (
					<PlanPicker data={section} />
			);
		case "plan-picker-alt":
			return (
					<PlanPickerAlt data={section} />
			);
		default:
			return null;
  }
}
