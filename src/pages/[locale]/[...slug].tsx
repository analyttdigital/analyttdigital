import Head from 'next/head';

import { SectionRenderer } from '@/components/sections/section-renderer';
import { defaults } from '@/lib/content/defaults';
import { locales } from '@/lib/content/types';
import { getStaticProps, type PageProps } from '@/lib/keystatic/getStaticProps';
import { site } from '@/lib/site';

export { getStaticProps };

export default function LocalePage({ bundle, locale, slug }: PageProps) {
  const page = bundle?.page ?? defaults[locale].pages[slug] ?? defaults[locale].pages.home;

  return (
    <>
      <Head>
        <title>{`${site.name} (${locale}) — ${page.title}`}</title>
        <meta name="description" content={page.description} />
      </Head>

      <SectionRenderer sections={page.sections} />
    </>
  );
}

export function getStaticPaths() {
  return {
    paths: locales
      .filter((l) => l !== 'en')
      .flatMap((locale) => [{ params: { locale, slug: ['home'] } }]),
    fallback: 'blocking',
  };
}
