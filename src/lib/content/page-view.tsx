import Head from 'next/head';

import { SectionRenderer } from '@/components/sections/section-renderer';
import { defaults } from '@/lib/content/defaults';
import { resolveSeo } from '@/lib/content/seo';
import type { PageProps } from '@/lib/keystatic/getStaticProps';

/**
 * The page document as it renders: head metadata from the page doc, then its
 * ordered section list. Every locale route shares this view — the route files
 * only differ in which params reach it (`[locale]/index.tsx` takes the one
 * segment, `[locale]/[...slug].tsx` the rest; see `routeFromParams`).
 */
export function PageView({ bundle, locale, slug, latestPosts }: PageProps) {
  const page = bundle?.page ?? defaults[locale].pages[slug] ?? defaults[locale].pages.home;
  const seo = resolveSeo(page, slug === 'home' ? '/' : `/${slug}`);

  return (
		<>
			<Head>
				<title>{seo.title}</title>
				<meta name="description" content={seo.description} />
				<link rel="canonical" href={seo.canonical} />
				<meta property="og:title" content={seo.title} />
				<meta property="og:description" content={seo.description} />
				<meta property="og:type" content="website" />
				{seo.noindex ? <meta name="robots" content="noindex, nofollow" /> : null}
				{seo.image ? <meta property="og:image" content={seo.image} /> : null}
				{seo.image && seo.imageAlt ? (
					<meta property="og:image:alt" content={seo.imageAlt} />
				) : null}
			</Head>

			<SectionRenderer sections={page.sections} latestPosts={latestPosts} />
		</>
  );
}
