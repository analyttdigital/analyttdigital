import { useMemo } from "react";
import { Render } from "@measured/puck";
import type { Data } from "@measured/puck";

import { buildConfig } from "@/builder/config/build-config";
import type { Page } from "@/builder/schema/page";
import { EditingProvider } from "./editing";

/**
 * Published-page renderer (M3). `ThemeProvider` (page level) supplies tokens;
 * Puck's `Render` draws the stored content with the same config the editor
 * used, so editor and public views cannot drift.
 */
export function BuilderRender({ page }: { page: Page }) {
  const config = useMemo(() => buildConfig(), []);
  // Stored docs predate runtime ids: Puck injects them on load, so the cast
  // covers the load-time gap, not a shape mismatch (validated by PageSchema).
  const data = page.puck as Data;
  return (
    <EditingProvider editing={false}>
      <Render config={config} data={data} />
    </EditingProvider>
  );
}
