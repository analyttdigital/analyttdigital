import Head from 'next/head';

import { SectionRenderer } from '@/components/sections/section-renderer';
import { defaults } from '@/lib/content/defaults';
import { getStaticProps, type PageProps } from '@/lib/keystatic/getStaticProps';
import { site } from '@/lib/site';

export { getStaticProps };

export default function HomePage({ bundle, locale, latestPosts }: PageProps) {
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

			<SectionRenderer sections={page.sections} latestPosts={latestPosts} />
			
		</>
  );
}
