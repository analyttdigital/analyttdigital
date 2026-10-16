import { useState } from "react";
import type { FormEvent } from "react";
import { DropZone } from "@measured/puck";

import { defineComponent } from "@/builder/registry";
import type { BuilderComponentDefinition } from "@/builder/registry";
import { useEditing } from "@/builder/render/editing";
import { formDefaults } from "./schema";
import type { FormProps } from "./schema";
import { formFields } from "./fields";

export function Form({ action, method, successMessage }: FormProps) {
  const editing = useEditing();
  const [notice, setNotice] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editing) {
      setNotice({ kind: "error", text: "Forms do not submit while editing." });
      return;
    }
    const data = new FormData(e.currentTarget);
    const payload = Object.fromEntries(data.entries());
    if (!action) {
      setNotice({ kind: "ok", text: successMessage });
      return;
    }
    try {
      if (method === "GET") {
        const query = new URLSearchParams(
          Object.entries(payload).map(([k, v]) => [k, String(v)]),
        ).toString();
        window.location.assign(`${action}?${query}`);
        return;
      }
      const res = await fetch(action, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      setNotice(
        res.ok
          ? { kind: "ok", text: successMessage }
          : { kind: "error", text: `Submit failed (${res.status}).` },
      );
    } catch {
      setNotice({ kind: "error", text: "Submit failed. Check the endpoint." });
    }
  };

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="font-bldBody">
      <DropZone zone="form" />
      {notice && (
        <p
          role="status"
          className={notice.kind === "ok" ? "text-bld-success" : "text-bld-danger"}
          style={{ marginTop: 8 }}
        >
          {notice.text}
        </p>
      )}
    </form>
  );
}

export const definition: BuilderComponentDefinition = defineComponent({
  name: "Form",
  label: "Form",
  category: "Forms",
  fields: formFields,
  defaultProps: formDefaults,
  render: Form,
});
