import Link from "next/link";
import type { ReactNode } from "react";

import { blankLayoutsFile } from "@/builder/schema/shared";
import type { LayoutEntry, LayoutsFile, SharedDoc } from "@/builder/schema/shared";
import { slugToRoute } from "./routes";
import { PuckContent } from "./render";

/**
 * Global layout wrapper (M6). `layouts.json` picks which shared docs
 * (announcement, header, sidebar, footer) wrap each page, so editing the
 * header once updates every page on that layout. Two shells: `page` (linear)
 * and `dashboard` (sidebar + topbar + main).
 */

export function resolveLayout(layouts: LayoutsFile, id: string): LayoutEntry {
  return (
    layouts.layouts.find((l) => l.id === id) ??
    layouts.layouts.find((l) => l.id === "default") ??
    blankLayoutsFile().layouts[0]
  );
}

export interface LayoutDocs {
  announcement?: SharedDoc | null;
  header?: SharedDoc | null;
  sidebar?: SharedDoc | null;
  footer?: SharedDoc | null;
}

export interface BuilderNavItem {
  title: string;
  slug: string;
}

function DefaultSidebarNav({ nav, currentSlug }: { nav: BuilderNavItem[]; currentSlug: string }) {
  return (
    <nav aria-label="Pages" className="font-bldBody" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {nav.map((item) => (
        <Link
          key={item.slug}
          href={slugToRoute(item.slug)}
          aria-current={item.slug === currentSlug ? "page" : undefined}
          className={item.slug === currentSlug ? "text-bld-text" : "text-bld-muted"}
          style={{ fontWeight: item.slug === currentSlug ? 600 : 400, padding: "6px 8px" }}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}

interface BuilderLayoutProps {
  layout: LayoutEntry;
  docs: LayoutDocs;
  slug: string;
  nav: BuilderNavItem[];
  children: ReactNode;
}

export function BuilderLayout({ layout, docs, slug, nav, children }: BuilderLayoutProps) {
  if (layout.shell === "dashboard") {
    return (
      <div style={{ display: "flex", minHeight: "100vh" }} className="bg-bld-background">
        <aside
          className="bg-bld-surface"
          style={{ width: 240, flexShrink: 0, padding: 16 }}
          aria-label="Sidebar"
        >
          {docs.sidebar ? <PuckContent data={docs.sidebar.puck} /> : <DefaultSidebarNav nav={nav} currentSlug={slug} />}
        </aside>
        <div style={{ flex: 1, minWidth: 0 }}>
          {docs.header && (
            <div className="bg-bld-surface" style={{ padding: "12px 24px" }}>
              <PuckContent data={docs.header.puck} />
            </div>
          )}
          <main style={{ padding: 24 }}>{children}</main>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bld-background text-bld-text">
      {docs.announcement && <PuckContent data={docs.announcement.puck} />}
      {docs.header && <PuckContent data={docs.header.puck} />}
      <main>{children}</main>
      {docs.footer && <PuckContent data={docs.footer.puck} />}
    </div>
  );
}
