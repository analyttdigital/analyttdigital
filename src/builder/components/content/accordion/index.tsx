import { useState } from "react";

import { defineComponent } from "@/builder/registry";
import type { BuilderComponentDefinition } from "@/builder/registry";
import { accordionDefaults } from "./schema";
import type { AccordionProps } from "./schema";
import { accordionFields } from "./fields";

export function Accordion({ items, allowMultiple }: AccordionProps) {
  const [open, setOpen] = useState<number[]>([]);

  const toggle = (index: number) => {
    setOpen((prev) => {
      if (prev.includes(index)) return prev.filter((i) => i !== index);
      return allowMultiple ? [...prev, index] : [index];
    });
  };

  return (
    <div className="font-bldBody">
      {items.map((item, i) => {
        const isOpen = open.includes(i);
        return (
          <div key={i} className="border-bld-border" style={{ borderBottomWidth: 1, borderBottomStyle: "solid" }}>
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => toggle(i)}
              className="text-bld-text"
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 0",
                fontWeight: 600,
                cursor: "pointer",
                background: "none",
                border: "none",
                textAlign: "left",
              }}
            >
              <span>{item.title}</span>
              <span aria-hidden="true" className="text-bld-muted">{isOpen ? "−" : "+"}</span>
            </button>
            {isOpen && (
              <p className="text-bld-text" style={{ paddingBottom: 16, margin: 0 }}>
                {item.content}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

export const definition: BuilderComponentDefinition = defineComponent({
  name: "Accordion",
  label: "Accordion",
  category: "Content",
  fields: accordionFields,
  defaultProps: accordionDefaults,
  render: Accordion,
});
