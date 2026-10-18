import Head from 'next/head';

import { BlogList } from '@/components/sections/blog-list';
import { BLOG_PAGE_SIZE, blogBasePath } from '@/lib/content/blog';
import { resolveSeo } from '@/lib/content/seo';
import {
  getBlogIndexStaticProps,
  type BlogIndexProps,
} from '@/lib/keystatic/getStaticProps';

export async function getStaticProps() {
  return getBlogIndexStaticProps('en', 1);
}

/** EN blog index (page 1). Later pages live under `/blog/page/[n]`. */
export default function BlogIndexPage({ blogIndex, locale }: BlogIndexProps) {
  const basePath = blogBasePath(locale);
  const seo = resolveSeo({ title: blogIndex.headline.replace(/\n/g, ' '), description: blogIndex.body }, basePath);
  return (
    <>
      <Head>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <link rel="canonical" href={seo.canonical} />
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
        <meta property="og:type" content="website" />
      </Head>

      <BlogList
        data={blogIndex}
        basePath={basePath}
        locale={locale}
        startIndex={(blogIndex.page - 1) * BLOG_PAGE_SIZE}
      />
    </>
  );
}
