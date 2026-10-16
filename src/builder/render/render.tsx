import { useMemo } from "react";
import { Render } from "@measured/puck";
import type { Data } from "@measured/puck";

import { buildConfig } from "@/builder/config/build-config";
import type { Page, PuckData } from "@/builder/schema/page";
import { EditingProvider } from "./editing";

/**
 * Published-page renderer (M3). `ThemeProvider` (page level) supplies tokens;
 * Puck's `Render` draws the stored content with the same config the editor
 * used, so editor and public views cannot drift.
 */
export function BuilderRender({ page }: { page: Page }) {
  return (
    <EditingProvider editing={false}>
      <PuckContent data={page.puck} />
    </EditingProvider>
  );
}

/** Raw Puck content renderer shared by pages and global docs (M6). */
export function PuckContent({ data }: { data: PuckData }) {
  const config = useMemo(() => buildConfig(), []);
  // Stored docs predate runtime ids: Puck injects them on load in the editor,
  // but the static `Render` path would warn about missing keys. Position
  // based ids are deterministic per document, so SSR and hydration agree.
  // Shape itself is unchanged (validated by PageSchema).
  const puckData = useMemo(() => withIds(data), [data]);
  return <Render config={config} data={puckData} />;
}

interface IdItem {
  id?: string;
  zones?: Record<string, IdItem[]>;
  [key: string]: unknown;
}

function withIds(data: PuckData): Data {
  const addIds = (items: IdItem[], prefix: string): IdItem[] =>
    items.map((item, i) => {
      const zones: Record<string, IdItem[]> = {};
      for (const [zone, children] of Object.entries(item.zones ?? {})) {
        zones[zone] = addIds(children, `${prefix}-${i}-${zone}`);
      }
      return { ...item, id: item.id ?? `${prefix}-${i}`, ...(Object.keys(zones).length > 0 ? { zones } : {}) };
    });
  return {
    root: data.root,
    content: addIds(data.content as IdItem[], "bld"),
    zones: Object.fromEntries(
      Object.entries(data.zones ?? {}).map(([zone, children]) => [zone, addIds(children as IdItem[], `bld-${zone}`)]),
    ),
  } as Data;
}
