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
  // Stored docs predate runtime ids: Puck injects them on load, so the cast
  // covers the load-time gap, not a shape mismatch (validated by PageSchema).
  const puckData = data as Data;
  return <Render config={config} data={puckData} />;
}
