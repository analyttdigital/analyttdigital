import { defineComponent } from "@/builder/registry";
import type { BuilderComponentDefinition } from "@/builder/registry";
import { radiusStyle } from "../../shared";
import { tableDefaults } from "./schema";
import type { TableProps } from "./schema";
import { tableFields } from "./fields";

export function Table({ headers, rows, striped }: TableProps) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table
        className="font-bldBody text-bld-text"
        style={{ width: "100%", borderCollapse: "collapse", ...radiusStyle("sm") }}
      >
        <thead>
          <tr className="bg-bld-surface">
            {headers.map((h, i) => (
              <th key={i} style={{ textAlign: "left", padding: "10px 12px" }} scope="col">
                {h.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={striped && i % 2 === 1 ? "bg-bld-surface" : undefined}>
              {headers.map((_, j) => (
                <td key={j} style={{ padding: "10px 12px", borderTop: "1px solid var(--bld-color-border)" }}>
                  {row.cells[j]?.value ?? ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const definition: BuilderComponentDefinition = defineComponent({
  name: "Table",
  label: "Table",
  category: "Content",
  fields: tableFields,
  defaultProps: tableDefaults,
  render: Table,
});
