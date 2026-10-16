import { defineComponent } from "@/builder/registry";
import type { BuilderComponentDefinition } from "@/builder/registry";
import { borderClass } from "../../shared";
import { quoteDefaults } from "./schema";
import type { QuoteProps } from "./schema";
import { quoteFields } from "./fields";

export function Quote({ text, author, color }: QuoteProps) {
  return (
    <blockquote
      className={`font-bldBody text-bld-text text-xl ${borderClass(color)}`}
      style={{ borderLeftWidth: 4, borderLeftStyle: "solid", paddingLeft: 16 }}
    >
      <p>{text}</p>
      {author && <cite className="text-bld-muted text-sm">— {author}</cite>}
    </blockquote>
  );
}

export const definition: BuilderComponentDefinition = defineComponent({
  name: "Quote",
  label: "Quote",
  category: "Typography",
  fields: quoteFields,
  defaultProps: quoteDefaults,
  render: Quote,
});
