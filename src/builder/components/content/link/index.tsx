import { defineComponent } from "@/builder/registry";
import type { BuilderComponentDefinition } from "@/builder/registry";
import { textColorClass } from "../../shared";
import { linkDefaults } from "./schema";
import type { LinkProps } from "./schema";
import { linkFields } from "./fields";

export function Link({ label, href, color, openInNewTab, underline }: LinkProps) {
  return (
    <a
      href={href}
      target={openInNewTab ? "_blank" : undefined}
      rel={openInNewTab ? "noreferrer" : undefined}
      className={`font-bldBody ${textColorClass(color)}`}
      style={{ textDecoration: underline ? "underline" : "none" }}
    >
      {label}
    </a>
  );
}

export const definition: BuilderComponentDefinition = defineComponent({
  name: "Link",
  label: "Link",
  category: "Actions",
  fields: linkFields,
  defaultProps: linkDefaults,
  render: Link,
});
