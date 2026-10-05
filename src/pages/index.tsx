import Head from 'next/head';

import { SectionRenderer } from '@/components/sections/section-renderer';
import { defaults } from '@/lib/content/defaults';
import { getStaticProps, type PageProps } from '@/lib/keystatic/getStaticProps';
import { site } from '@/lib/site';
import { PathFlowSection } from '@/components/graphics/path-flow-section';

export { getStaticProps };

export default function HomePage({ bundle, locale }: PageProps) {
  const page = bundle?.page ?? defaults[locale].pages.home;

  return (
		<>
			<Head>
				<title>{`${site.name} — ${page.description.slice(0, 60)}`}</title>
				<meta name="description" content={page.description} />
				<meta property="og:title" content={site.name} />
				<meta property="og:description" content={page.description} />
				<meta property="og:type" content="website" />
			</Head>

			<SectionRenderer sections={page.sections} />

			<PathFlowSection
				variant="staircase-rtl" // "staircase-ltr" | "staircase-rtl" | "edges-converge" | "cross-flow"
				mode="scroll" // or "auto"
				trailColor="#ff0000"
				header={<h2 className="text-7xl">test</h2>}
			>
				<p> Hello, World! </p> <p> Hello, World! </p> <p> Hello, World! </p>
				{/* child N goes in slot N of the variant */}
			</PathFlowSection>
		</>
  );
}
