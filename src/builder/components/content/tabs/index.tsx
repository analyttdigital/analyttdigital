import { useState } from "react";

import { defineComponent } from "@/builder/registry";
import type { BuilderComponentDefinition } from "@/builder/registry";
import { tabsDefaults } from "./schema";
import type { TabsProps } from "./schema";
import { tabsFields } from "./fields";

export function Tabs({ tabs }: TabsProps) {
  const [active, setActive] = useState(0);
  const current = tabs[Math.min(active, Math.max(tabs.length - 1, 0))];

  return (
    <div className="font-bldBody">
      <div role="tablist" aria-label="Tabs" style={{ display: "flex", gap: 4 }}>
        {tabs.map((tab, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={i === active ? "text-bld-text" : "text-bld-muted"}
            style={{
              padding: "8px 16px",
              borderBottomWidth: 2,
              borderBottomStyle: "solid",
              borderBottomColor: i === active ? "var(--bld-color-primary)" : "transparent",
              background: "none",
              borderTop: "none",
              borderLeft: "none",
              borderRight: "none",
              cursor: "pointer",
              fontWeight: i === active ? 600 : 400,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {current && (
        <div role="tabpanel" className="text-bld-text" style={{ paddingTop: 16 }}>
          {current.content}
        </div>
      )}
    </div>
  );
}

export const definition: BuilderComponentDefinition = defineComponent({
  name: "Tabs",
  label: "Tabs",
  category: "Content",
  fields: tabsFields,
  defaultProps: tabsDefaults,
  render: Tabs,
});
