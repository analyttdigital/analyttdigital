import type { ReactNode } from "react";
import { defineComponent } from "@/builder/registry";
import type { BuilderComponentDefinition } from "@/builder/registry";
import { alignClass, sizeClass, textColorClass } from "../../shared";
import { richTextDefaults } from "./schema";
import type { RichTextProps } from "./schema";
import { richTextFields } from "./fields";

/** `**bold**` inline segments. Plain text otherwise. */
function renderInline(text: string, keyPrefix: string): ReactNode[] {
  return text.split("**").map((part, i) =>
    i % 2 === 1 ? <strong key={`${keyPrefix}-${i}`}>{part}</strong> : <span key={`${keyPrefix}-${i}`}>{part}</span>,
  );
}

export function RichText({ content, size, align, color }: RichTextProps) {
  const paragraphs = content.split(/\n\s*\n/).filter((p) => p.trim().length > 0);
  return (
    <div className={`font-bldBody ${sizeClass(size)} ${alignClass(align)} ${textColorClass(color)}`}>
      {paragraphs.map((p, i) => (
        <p key={i} style={{ marginBottom: i < paragraphs.length - 1 ? "1em" : 0 }}>
          {renderInline(p.trim(), `p${i}`)}
        </p>
      ))}
    </div>
  );
}

export const definition: BuilderComponentDefinition = defineComponent({
  name: "RichText",
  label: "Rich text",
  category: "Typography",
  fields: richTextFields,
  defaultProps: richTextDefaults,
  render: RichText,
});
