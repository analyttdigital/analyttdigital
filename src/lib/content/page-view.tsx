import Head from 'next/head';

import { SectionRenderer } from '@/components/sections/section-renderer';
import { defaults } from '@/lib/content/defaults';
import type { PageProps } from '@/lib/keystatic/getStaticProps';
import { site } from '@/lib/site';

/**
 * The page document as it renders: head metadata from the page doc, then its
 * ordered section list. Every locale route shares this view — the route files
 * only differ in which params reach it (`[locale]/index.tsx` takes the one
 * segment, `[locale]/[...slug].tsx` the rest; see `routeFromParams`).
 */
export function PageView({ bundle, locale, slug, latestPosts }: PageProps) {
  const page = bundle?.page ?? defaults[locale].pages[slug] ?? defaults[locale].pages.home;
  // Page featured images are upload paths (`/media/uploads/…`); social
  // scrapers need an absolute URL. Empty `src` means no image at all.
  const featuredImage = page.featuredImage?.src
    ? new URL(page.featuredImage.src, site.url).toString()
    : '';

  return (
		<>
			<Head>
				<title>{`${page.title} - ${site.name} `}</title>
				<meta name="description" content={page.description} />
				{featuredImage ? <meta property="og:image" content={featuredImage} /> : null}
				{featuredImage && page.featuredImage?.alt ? (
					<meta property="og:image:alt" content={page.featuredImage.alt} />
				) : null}
			</Head>

			<SectionRenderer sections={page.sections} latestPosts={latestPosts} />
		</>
  );
}
