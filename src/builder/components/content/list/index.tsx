import { defineComponent } from "@/builder/registry";
import type { BuilderComponentDefinition } from "@/builder/registry";
import { textColorClass } from "../../shared";
import { listDefaults } from "./schema";
import type { ListProps } from "./schema";
import { listFields } from "./fields";

export function List({ items, variant, color }: ListProps) {
  const cls = `font-bldBody ${textColorClass(color)}`;
  if (variant === "numbered") {
    return (
      <ol className={cls} style={{ listStyle: "decimal", paddingLeft: 24 }}>
        {items.map((item, i) => (
          <li key={i}>{item.text}</li>
        ))}
      </ol>
    );
  }
  if (variant === "checks") {
    return (
      <ul className={cls} style={{ listStyle: "none", paddingLeft: 0 }}>
        {items.map((item, i) => (
          <li key={i} style={{ display: "flex", gap: 8 }}>
            <span aria-hidden="true" className="text-bld-success">✓</span>
            <span>{item.text}</span>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <ul className={cls} style={{ listStyle: "disc", paddingLeft: 24 }}>
      {items.map((item, i) => (
        <li key={i}>{item.text}</li>
      ))}
    </ul>
  );
}

export const definition: BuilderComponentDefinition = defineComponent({
  name: "List",
  label: "List",
  category: "Content",
  fields: listFields,
  defaultProps: listDefaults,
  render: List,
});
