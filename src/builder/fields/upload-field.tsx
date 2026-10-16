import { useRef, useState } from "react";
import type { CustomField } from "@measured/puck";

/**
 * Media URL field with upload (M9.1). A URL text input plus an upload button
 * that posts base64 JSON to `/api/builder/media` and fills in the returned
 * URL, with an inline preview. Used by the Image and Video `src` fields.
 */
export function MediaUrlField(options: { accept: string }): CustomField<string> {
  const { accept } = options;
  return {
    type: "custom",
    render: ({ id, value, onChange, readOnly }) => (
      <MediaUrlInput id={id} value={value} onChange={onChange} readOnly={readOnly} accept={accept} />
    ),
  };
}

interface MediaUrlInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  accept: string;
}

function MediaUrlInput({ id, value, onChange, readOnly, accept }: MediaUrlInputProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const isVideo = accept.includes("video");

  const upload = async (file: File) => {
    setBusy(true);
    setError(null);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result ?? ""));
        reader.onerror = () => reject(new Error("Could not read file"));
        reader.readAsDataURL(file);
      });
      const content = dataUrl.includes(",") ? dataUrl.split(",", 2)[1] : "";
      const res = await fetch("/api/builder/media", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ filename: file.name, content }),
      });
      const body = (await res.json()) as { url?: unknown; error?: unknown };
      if (!res.ok) {
        throw new Error(typeof body.error === "string" ? body.error : `Upload failed (${res.status})`);
      }
      if (typeof body.url !== "string" || body.url.length === 0) {
        throw new Error("Upload failed: no URL returned");
      }
      onChange(body.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div>
      <input
        id={id}
        type="text"
        value={value}
        disabled={readOnly || busy}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://… or upload below"
        style={{ width: "100%", marginBottom: 6 }}
      />
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <button
          type="button"
          disabled={readOnly || busy}
          onClick={() => fileRef.current?.click()}
        >
          {busy ? "Uploading…" : "Upload file"}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept={accept}
          disabled={readOnly || busy}
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void upload(file);
          }}
        />
      </div>
      {error && (
        <p role="alert" style={{ color: "#b91c1c", fontSize: 12, margin: "4px 0 0" }}>
          {error}
        </p>
      )}
      {value && !isVideo && (
        <img src={value} alt="" style={{ width: "100%", marginTop: 6, borderRadius: 4 }} />
      )}
      {value && isVideo && (
        <video src={value} muted preload="metadata" style={{ width: "100%", marginTop: 6, borderRadius: 4 }} />
      )}
    </div>
  );
}
