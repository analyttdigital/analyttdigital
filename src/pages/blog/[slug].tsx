import Head from 'next/head';

import { BlogPostView } from '@/components/sections/blog-post';
import { blogBasePath } from '@/lib/content/blog';
import { resolveSeo } from '@/lib/content/seo';
import {
  blogPostPaths,
  getBlogPostStaticProps,
  type BlogPostProps,
} from '@/lib/keystatic/getStaticProps';

export async function getStaticPaths() {
  const slugs = await blogPostPaths('en');
  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: 'blocking' as const,
  };
}

export async function getStaticProps({ params }: { params?: { slug?: string } }) {
  if (!params?.slug) return { notFound: true as const };
  return getBlogPostStaticProps('en', params.slug);
}

/** EN post page. Unknown slugs are 404 — never another post. */
export default function BlogPostPage({ blogPost, blogCopy, locale }: BlogPostProps) {
  const seo = resolveSeo(blogPost, `/blog/${blogPost.slug}`);
  return (
    <>
      <Head>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <link rel="canonical" href={seo.canonical} />
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
        <meta property="og:type" content="article" />
        {seo.noindex ? <meta name="robots" content="noindex, nofollow" /> : null}
        {seo.image ? <meta property="og:image" content={seo.image} /> : null}
        {seo.image && seo.imageAlt ? <meta property="og:image:alt" content={seo.imageAlt} /> : null}
        {blogPost.publishedAt ? <meta property="article:published_time" content={blogPost.publishedAt} /> : null}
      </Head>

      <BlogPostView
        data={{ post: blogPost, copy: blogCopy }}
        basePath={blogBasePath(locale)}
        locale={locale}
      />
    </>
  );
}
