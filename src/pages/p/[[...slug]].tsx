import type { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";

import { BuilderLayout, resolveLayout } from "@/builder/render/layout";
import type { BuilderNavItem, LayoutDocs } from "@/builder/render/layout";
import { BuilderRender } from "@/builder/render/render";
import { ThemeProvider } from "@/builder/render/theme-provider";
import { fileToRoute, routeToSlug } from "@/builder/render/routes";
import { PageSchema, fileToSlug } from "@/builder/schema/page";
import type { Page } from "@/builder/schema/page";
import { LayoutsFileSchema, SharedDocSchema, blankLayoutsFile } from "@/builder/schema/shared";
import type { LayoutEntry } from "@/builder/schema/shared";
import { parseThemeFile } from "@/builder/schema/theme-file";
import type { Theme } from "@/builder/schema/theme-file";
import { builderFontsClass } from "@/builder/theme/fonts";
import { defaultTheme } from "@/builder/theme/defaults";
import type { ContentStore } from "@/builder/storage/types";

/**
 * Builder public renderer (M3). Builder pages live under `/p/*` (never the
 * site root) — see `src/builder/render/routes.ts`. Drafts and unknown slugs
 * 404. Content is build-time JSON; a publish commit redeploys the site.
 * (M6) Pages render inside their layout's shared docs (announcement,
 * header, sidebar, footer).
 */

interface Props {
  page: Page;
  slug: string;
  theme: Theme;
  layout: LayoutEntry;
  docs: LayoutDocs;
  nav: BuilderNavItem[];
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { getStore } = await import("@/builder/storage");
  const store = getStore();
  const files = await store.list("pages");
  const paths = files
    .map((f) => fileToRoute(f))
    .filter((r): r is string => r !== null)
    .map((route) => ({ params: { slug: route === "/p" ? [] : [route.slice(3)] } }));
  return { paths, fallback: "blocking" };
};

async function loadSharedDoc(store: ContentStore, name: string | null) {
  if (!name) return null;
  const stored = await store.read<unknown>(`shared/${name}.json`);
  if (!stored) return null;
  const parsed = SharedDocSchema.safeParse(stored.data);
  return parsed.success ? parsed.data : null;
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const segments = params?.slug;
  const slug = routeToSlug(Array.isArray(segments) ? segments : undefined);
  if (slug === null) return { notFound: true };

  const { getStore } = await import("@/builder/storage");
  const store = getStore();

  const stored = await store.read<unknown>(`pages/${slug}.json`);
  if (stored === null) return { notFound: true };
  const parsed = PageSchema.safeParse(stored.data);
  if (!parsed.success || parsed.data.draft) return { notFound: true };
  const page = parsed.data;

  const themeStored = await store.read<unknown>("theme.json");
  let theme = defaultTheme;
  if (themeStored) {
    try {
      theme = parseThemeFile(themeStored.data);
    } catch {
      theme = defaultTheme;
    }
  }

  const layoutsStored = await store.read<unknown>("shared/layouts.json");
  const layoutsParsed = layoutsStored ? LayoutsFileSchema.safeParse(layoutsStored.data) : null;
  const layouts = layoutsParsed?.success ? layoutsParsed.data : blankLayoutsFile();
  const layout = resolveLayout(layouts, page.meta.layout);

  const [announcement, header, sidebar, footer] = await Promise.all([
    loadSharedDoc(store, layout.announcement),
    loadSharedDoc(store, layout.header),
    loadSharedDoc(store, layout.sidebar),
    loadSharedDoc(store, layout.footer),
  ]);

  // Dashboard shell fallback nav: published pages with titles.
  const files = await store.list("pages");
  const nav: BuilderNavItem[] = [];
  for (const file of files) {
    const pageSlug = fileToSlug(file);
    if (!pageSlug) continue;
    const entry = await store.read<unknown>(file);
    if (!entry) continue;
    const entryParsed = PageSchema.safeParse(entry.data);
    if (!entryParsed.success || entryParsed.data.draft) continue;
    nav.push({ title: entryParsed.data.meta.title || pageSlug, slug: pageSlug });
  }
  nav.sort((a, b) => a.title.localeCompare(b.title));

  return {
    props: {
      page,
      slug,
      theme,
      layout,
      docs: { announcement, header, sidebar, footer },
      nav,
    },
  };
};

export default function BuilderPage({ page, slug, theme, layout, docs, nav }: Props) {
  return (
    <>
      <Head>
        <title>{page.meta.title}</title>
        {page.meta.description && <meta name="description" content={page.meta.description} />}
        {page.meta.ogImage && <meta property="og:image" content={page.meta.ogImage} />}
      </Head>
      <div className={builderFontsClass}>
        <ThemeProvider theme={theme}>
          <BuilderLayout layout={layout} docs={docs} slug={slug} nav={nav}>
            <BuilderRender page={page} />
          </BuilderLayout>
        </ThemeProvider>
      </div>
    </>
  );
}
