import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Puck } from "@measured/puck";
import type { Data } from "@measured/puck";

import { buildConfig } from "@/builder/config/build-config";
import { EditingProvider } from "@/builder/render/editing";
import { ThemeProvider } from "@/builder/render/theme-provider";
import { slugToRoute } from "@/builder/render/routes";
import { PageSchema } from "@/builder/schema/page";
import type { Page, PageMeta, PuckData } from "@/builder/schema/page";
import {
  LayoutsFileSchema,
  SharedDocSchema,
  assertValidSharedDocName,
  blankLayoutsFile,
} from "@/builder/schema/shared";
import type { LayoutEntry } from "@/builder/schema/shared";
import { defaultTheme } from "@/builder/theme/defaults";
import { CURATED_FONTS } from "@/builder/theme/fonts";
import { ThemeSchema } from "@/builder/schema/theme-file";
import { COLOR_TOKENS, RADIUS_KEYS, SPACING_DENSITIES } from "@/builder/theme/schema";
import type { ColorToken, RadiusKey, SpacingDensity, Theme } from "@/builder/theme/schema";

/**
 * Visual editor entry (M3). Loaded client-only (`ssr: false`) from
 * `src/pages/admin/[[...puckPath]].tsx`. URL-driven:
 *
 *   /admin               dashboard: page list + create/duplicate/rename/delete
 *   /admin/page/<slug>   Puck canvas + meta editor for one page
 *   /admin/theme         theme tokens with live preview, saves to theme.json
 *
 * Globals (header/footer/layouts) join the switcher in M6.
 */

interface Status {
  kind: "ok" | "error";
  text: string;
}

/** Thrown by `api()` on HTTP 409 so editors can offer reload instead of plain text. */
export class ApiConflictError extends Error {
  readonly status = 409;
  constructor(message: string) {
    super(message);
    this.name = "ApiConflictError";
  }
}

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    headers: { "content-type": "application/json" },
    ...init,
  });
  const body = (await res.json()) as unknown;
  if (!res.ok) {
    const msg =
      typeof body === "object" && body !== null && "error" in body
        ? String((body as { error: unknown }).error)
        : `Request failed (${res.status})`;
    if (res.status === 409) throw new ApiConflictError(msg);
    throw new Error(msg);
  }
  return body as T;
}

/** Best-effort on-demand revalidation after a publish (M7). Never fails the save. */
async function revalidatePaths(paths: string[]): Promise<string | null> {
  try {
    const body = await api<{ results: { path: string; ok: boolean }[] }>("/api/builder/revalidate", {
      method: "POST",
      body: JSON.stringify({ paths }),
    });
    const failed = body.results.filter((r) => !r.ok);
    return failed.length > 0 ? `revalidate failed for ${failed.map((r) => r.path).join(", ")}` : null;
  } catch (err) {
    return err instanceof Error ? `revalidate failed: ${err.message}` : "revalidate failed";
  }
}

/** Revalidate the index plus every known page route (for shared/theme/layout saves). */
async function revalidateSite(): Promise<string | null> {
  try {
    const body = await api<{ pages: string[] }>("/api/builder/pages");
    const paths = ["/p", ...body.pages.map((s) => slugToRoute(s))];
    return revalidatePaths([...new Set(paths)]);
  } catch (err) {
    return err instanceof Error ? `revalidate failed: ${err.message}` : "revalidate failed";
  }
}

/** Session handed down by the admin page (M7). Absent in dev bypass. */
const BuilderSessionContext = createContext<{ authRequired: boolean; login: string | null }>({
  authRequired: false,
  login: null,
});

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "6px 8px",
  border: "1px solid #cbd5e1",
  borderRadius: 6,
  fontSize: 13,
};

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label style={{ display: "block", marginBottom: 10, fontSize: 13 }}>
      <span style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>{label}</span>
      {children}
    </label>
  );
}

function TopBar({ title, status }: { title: string; status: Status | null }) {
  const session = useContext(BuilderSessionContext);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "8px 16px",
        background: "#0f172a",
        color: "#e2e8f0",
        fontSize: 14,
      }}
    >
      <strong>Builder</strong>
      <nav style={{ display: "flex", gap: 12 }}>
        <Link href="/admin" style={{ color: "#e2e8f0" }}>
          Pages
        </Link>
        <Link href="/admin/theme" style={{ color: "#e2e8f0" }}>
          Theme
        </Link>
      </nav>
      <span style={{ marginLeft: 8, color: "#94a3b8" }}>{title}</span>
      {status && (
        <span style={{ color: status.kind === "ok" ? "#4ade80" : "#f87171" }}>{status.text}</span>
      )}
      <span style={{ marginLeft: "auto" }}>
        {session.authRequired && session.login ? (
          <>
            <span style={{ color: "#94a3b8", marginRight: 8 }}>{session.login}</span>
            <button type="button" onClick={() => void signOut({ callbackUrl: "/" })}>
              Sign out
            </button>
          </>
        ) : session.authRequired ? (
          <button type="button" onClick={() => void signIn("github", { callbackUrl: "/admin" })}>
            Sign in
          </button>
        ) : null}
      </span>
    </div>
  );
}

/* ---------------------------------- dashboard ---------------------------------- */

function Dashboard() {
  const router = useRouter();
  const [pages, setPages] = useState<string[]>([]);
  const [status, setStatus] = useState<Status | null>(null);
  const [slug, setSlug] = useState("");
  const [source, setSource] = useState("");
  const [target, setTarget] = useState("");
  const [customDoc, setCustomDoc] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const body = await api<{ pages: string[] }>("/api/builder/pages");
      setPages(body.pages);
    } catch (err) {
      setStatus({ kind: "error", text: err instanceof Error ? err.message : "Load failed" });
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const create = async () => {
    try {
      const body = await api<{ slug: string }>("/api/builder/pages", {
        method: "POST",
        body: JSON.stringify({ slug: slug.trim() }),
      });
      void router.push(`/admin/page/${body.slug}`);
    } catch (err) {
      setStatus({ kind: "error", text: err instanceof Error ? err.message : "Create failed" });
    }
  };

  const duplicate = async () => {
    try {
      const src = await api<{ data: Page }>(`/api/builder/page?slug=${encodeURIComponent(source)}`);
      const page = PageSchema.parse(src.data);
      await api("/api/builder/pages", {
        method: "POST",
        body: JSON.stringify({ slug: target.trim(), data: { ...page, draft: true } }),
      });
      void router.push(`/admin/page/${target.trim()}`);
    } catch (err) {
      setStatus({ kind: "error", text: err instanceof Error ? err.message : "Duplicate failed" });
    }
  };

  const rename = async () => {
    try {
      const src = await api<{ data: Page }>(`/api/builder/page?slug=${encodeURIComponent(source)}`);
      await api("/api/builder/pages", {
        method: "POST",
        body: JSON.stringify({ slug: target.trim(), data: src.data }),
      });
      await api(`/api/builder/pages?slug=${encodeURIComponent(source)}`, { method: "DELETE" });
      void router.push(`/admin/page/${target.trim()}`);
    } catch (err) {
      setStatus({ kind: "error", text: err instanceof Error ? err.message : "Rename failed" });
    }
  };

  const remove = async (name: string) => {
    if (confirmDelete !== name) {
      setConfirmDelete(name);
      return;
    }
    try {
      await api(`/api/builder/pages?slug=${encodeURIComponent(name)}`, { method: "DELETE" });
      setConfirmDelete(null);
      void refresh();
    } catch (err) {
      setStatus({ kind: "error", text: err instanceof Error ? err.message : "Delete failed" });
    }
  };

  return (
    <div>
      <TopBar title="Pages" status={status} />
      <div style={{ padding: 24, maxWidth: 720 }}>
        <h1 style={{ fontSize: 20, marginBottom: 12 }}>Pages</h1>
        <ul style={{ marginBottom: 24 }}>
          {pages.map((name) => (
            <li key={name} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
              <Link href={`/admin/page/${name}`}>{name}</Link>
              <a
                href={slugToRoute(name)}
                target="_blank"
                rel="noreferrer"
                style={{ fontSize: 12, color: "#64748b" }}
              >
                view
              </a>
              <button type="button" onClick={() => void remove(name)} style={{ fontSize: 12 }}>
                {confirmDelete === name ? "confirm delete" : "delete"}
              </button>
            </li>
          ))}
          {pages.length === 0 && <li style={{ color: "#64748b" }}>No pages yet — create one below.</li>}
        </ul>
        <h2 style={{ fontSize: 16, marginBottom: 8 }}>Create</h2>
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="new-slug"
            style={inputStyle}
          />
          <button type="button" onClick={() => void create()}>
            Create
          </button>
        </div>
        <h2 style={{ fontSize: 16, marginBottom: 8 }}>Duplicate / rename</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="source slug"
            style={inputStyle}
          />
          <input
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="target slug"
            style={inputStyle}
          />
          <button type="button" onClick={() => void duplicate()}>
            Duplicate
          </button>
          <button type="button" onClick={() => void rename()}>
            Rename
          </button>
        </div>
        <h2 style={{ fontSize: 16, margin: "24px 0 8px" }}>Globals</h2>
        <p style={{ fontSize: 13, color: "#64748b", marginBottom: 8 }}>
          Shared docs wrap every page on their layout — edit once, publish everywhere.
        </p>
        <ul style={{ marginBottom: 12 }}>
          <li>
            <Link href="/admin/shared/header">Header</Link>
          </li>
          <li>
            <Link href="/admin/shared/footer">Footer</Link>
          </li>
          <li>
            <Link href="/admin/layouts">Layouts</Link>
          </li>
        </ul>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={customDoc}
            onChange={(e) => setCustomDoc(e.target.value)}
            placeholder="other doc, e.g. announcement"
            style={inputStyle}
          />
          <button
            type="button"
            onClick={() => {
              try {
                assertValidSharedDocName(customDoc.trim());
                void router.push(`/admin/shared/${customDoc.trim()}`);
              } catch (err) {
                setStatus({ kind: "error", text: err instanceof Error ? err.message : "Invalid doc" });
              }
            }}
          >
            Open doc
          </button>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------- page editor --------------------------------- */

function PageEditor({ slug }: { slug: string }) {
  const [page, setPage] = useState<Page | null>(null);
  const [meta, setMeta] = useState<PageMeta | null>(null);
  const [draft, setDraft] = useState(false);
  const [sha, setSha] = useState<string | undefined>(undefined);
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [layoutIds, setLayoutIds] = useState<string[] | null>(null);
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState<Status | null>(null);
  const [conflict, setConflict] = useState<{ latestBlocks: number; mineBlocks: number } | null>(null);
  const [confirmLoad, setConfirmLoad] = useState(false);
  const [reloadCount, setReloadCount] = useState(0);
  const latestRef = useRef<{ meta: PageMeta; draft: boolean; puck: PuckData; sha?: string } | null>(null);
  const dataRef = useRef<PuckData | null>(null);
  const config = useMemo(() => buildConfig(), []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [pageBody, themeBody, layoutsBody] = await Promise.all([
          api<{ data: unknown; sha?: string }>(`/api/builder/page?slug=${encodeURIComponent(slug)}`),
          api<{ data: unknown }>(`/api/builder/theme`),
          api<{ data: unknown }>(`/api/builder/shared?doc=layouts`).catch(() => null),
        ]);
        if (cancelled) return;
        const loaded = PageSchema.parse(pageBody.data);
        setPage(loaded);
        setMeta(loaded.meta);
        setDraft(loaded.draft);
        setSha(pageBody.sha);
        dataRef.current = loaded.puck;
        try {
          setTheme(ThemeSchema.parse(themeBody.data));
        } catch {
          setTheme(defaultTheme);
        }
        try {
          setLayoutIds(
            layoutsBody ? LayoutsFileSchema.parse(layoutsBody.data).layouts.map((l) => l.id) : null,
          );
        } catch {
          setLayoutIds(null);
        }
      } catch (err) {
        if (!cancelled) setStatus({ kind: "error", text: err instanceof Error ? err.message : "Load failed" });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const noteConflict = async () => {
    try {
      const latest = await api<{ data: unknown; sha?: string }>(
        `/api/builder/page?slug=${encodeURIComponent(slug)}`,
      );
      const parsed = PageSchema.parse(latest.data);
      latestRef.current = { meta: parsed.meta, draft: parsed.draft, puck: parsed.puck, sha: latest.sha };
      setConflict({
        latestBlocks: parsed.puck.content.length,
        mineBlocks: dataRef.current?.content.length ?? 0,
      });
      setConfirmLoad(false);
    } catch (err) {
      setStatus({ kind: "error", text: err instanceof Error ? err.message : "Publish failed" });
    }
  };

  const loadLatest = () => {
    if (!confirmLoad) {
      setConfirmLoad(true);
      return;
    }
    const latest = latestRef.current;
    if (!latest) return;
    setMeta(latest.meta);
    setDraft(latest.draft);
    setSha(latest.sha);
    dataRef.current = latest.puck;
    setReloadCount((n) => n + 1);
    setDirty(false);
    setConflict(null);
    setConfirmLoad(false);
    setStatus({ kind: "ok", text: "Loaded the latest published version" });
  };

  const save = async (puck: PuckData, nextMeta: PageMeta, nextDraft: boolean) => {
    const payload = PageSchema.parse({
      schemaVersion: 1,
      meta: nextMeta,
      puck,
      draft: nextDraft,
    });
    try {
      const body = await api<{ sha?: string; commitSha?: string; prUrl?: string; prError?: string }>(
        "/api/builder/page",
        {
          method: "PUT",
          body: JSON.stringify({ slug, data: payload, sha }),
        },
      );
      setSha(body.sha);
      setDirty(false);
      setConflict(null);
      setConfirmLoad(false);
      let text = body.commitSha ? `Published (${body.commitSha.slice(0, 7)})` : "Saved";
      if (body.prUrl) text += ` — review PR: ${body.prUrl}`;
      else if (body.prError) text += ` (PR notice: ${body.prError})`;
      const revalidateError = await revalidatePaths(["/p", slugToRoute(slug)]);
      setStatus({ kind: "ok", text: revalidateError ? `${text} (${revalidateError})` : text });
    } catch (err) {
      if (err instanceof ApiConflictError) {
        await noteConflict();
        return;
      }
      setStatus({ kind: "error", text: err instanceof Error ? err.message : "Save failed" });
    }
  };

  const handlePublish = async (data: Data) => {
    if (!meta) return;
    try {
      // Validated server-side too; the parse here keeps the payload typed.
      const puck = PageSchema.shape.puck.parse(data);
      await save(puck, meta, draft);
    } catch (err) {
      setStatus({ kind: "error", text: err instanceof Error ? err.message : "Publish failed" });
    }
  };

  const saveMeta = async () => {
    if (!meta || !dataRef.current) return;
    try {
      await save(dataRef.current, meta, draft);
    } catch (err) {
      setStatus({ kind: "error", text: err instanceof Error ? err.message : "Save failed" });
    }
  };

  const setMetaField = <K extends keyof PageMeta>(key: K, value: PageMeta[K]) => {
    setMeta((m) => (m ? { ...m, [key]: value } : m));
    setDirty(true);
  };

  return (
    <div>
      <TopBar title={`/admin/page/${slug}${dirty ? " (unsaved)" : ""}`} status={status} />
      {conflict && (
        <div
          role="alert"
          style={{ background: "#fef3c7", color: "#92400e", padding: "8px 16px", fontSize: 13 }}
        >
          Newer version on server ({conflict.latestBlocks} blocks) vs your unsaved canvas (
          {conflict.mineBlocks} blocks).{" "}
          <button type="button" onClick={loadLatest}>
            {confirmLoad ? "Confirm: discard my changes and load latest" : "Load latest"}
          </button>{" "}
          <button
            type="button"
            onClick={() => {
              setConflict(null);
              setConfirmLoad(false);
            }}
          >
            Keep editing
          </button>
        </div>
      )}
      {!page || !meta ? (
        <p style={{ padding: 24 }}>{status ? "Failed to load." : "Loading…"}</p>
      ) : (
        <div style={{ display: "flex", gap: 0 }}>
          <aside style={{ width: 280, padding: 16, borderRight: "1px solid #e2e8f0" }}>
            <h2 style={{ fontSize: 14, marginBottom: 8 }}>Meta</h2>
            <Field label="Title">
              <input value={meta.title} onChange={(e) => setMetaField("title", e.target.value)} style={inputStyle} />
            </Field>
            <Field label="Description">
              <textarea
                value={meta.description}
                onChange={(e) => setMetaField("description", e.target.value)}
                style={inputStyle}
              />
            </Field>
            <Field label="Path">
              <input value={meta.path} onChange={(e) => setMetaField("path", e.target.value)} style={inputStyle} />
            </Field>
            <Field label="Layout">
              {layoutIds ? (
                <select
                  value={layoutIds.includes(meta.layout) ? meta.layout : ""}
                  onChange={(e) => setMetaField("layout", e.target.value)}
                  style={inputStyle}
                >
                  {!layoutIds.includes(meta.layout) && <option value="">{meta.layout} (missing)</option>}
                  {layoutIds.map((id) => (
                    <option key={id} value={id}>
                      {id}
                    </option>
                  ))}
                </select>
              ) : (
                <input value={meta.layout} onChange={(e) => setMetaField("layout", e.target.value)} style={inputStyle} />
              )}
            </Field>
            <Field label="OG image">
              <input value={meta.ogImage} onChange={(e) => setMetaField("ogImage", e.target.value)} style={inputStyle} />
            </Field>
            <label style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 13, marginBottom: 12 }}>
              <input
                type="checkbox"
                checked={draft}
                onChange={(e) => {
                  setDraft(e.target.checked);
                  setDirty(true);
                }}
              />
              Draft (hidden from the public site)
            </label>
            <button type="button" onClick={() => void saveMeta()} style={{ width: "100%" }}>
              Save meta
            </button>
            <p style={{ fontSize: 12, color: "#64748b", marginTop: 12 }}>
              Content saves via Puck&apos;s Publish button. View at{" "}
              <a href={slugToRoute(slug)} target="_blank" rel="noreferrer">
                {slugToRoute(slug)}
              </a>{" "}
              after publishing{draft ? " (uncheck Draft first)" : ""}.
            </p>
          </aside>
          <div style={{ flex: 1, height: "calc(100vh - 41px)", overflow: "auto" }}>
            <EditingProvider editing={true}>
              <ThemeProvider theme={theme}>
                <Puck
                  key={`${slug}-${reloadCount}`}
                  config={config}
                  data={page.puck}
                  onChange={(data) => {
                    dataRef.current = PageSchema.shape.puck.parse(data);
                    setDirty(true);
                  }}
                  onPublish={(data) => void handlePublish(data)}
                />
              </ThemeProvider>
            </EditingProvider>
          </div>
        </div>
      )}
    </div>
  );
}

/* -------------------------------- theme editor --------------------------------- */

function ThemeEditor() {
  const [theme, setTheme] = useState<Theme | null>(null);
  const [sha, setSha] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const body = await api<{ data: unknown; sha?: string }>("/api/builder/theme");
        if (cancelled) return;
        setTheme(ThemeSchema.parse(body.data));
        setSha(body.sha);
      } catch (err) {
        if (!cancelled) setStatus({ kind: "error", text: err instanceof Error ? err.message : "Load failed" });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const setColor = (token: ColorToken, mode: "light" | "dark", value: string) => {
    setTheme((t) => (t ? { ...t, colors: { ...t.colors, [token]: { ...t.colors[token], [mode]: value } } } : t));
  };

  const save = async () => {
    if (!theme) return;
    try {
      const body = await api<{ sha?: string; commitSha?: string; prUrl?: string; prError?: string }>(
        "/api/builder/theme",
        {
          method: "PUT",
          body: JSON.stringify({ data: theme, sha }),
        },
      );
      setSha(body.sha);
      let text = "Theme saved";
      if (body.prUrl) text += ` — review PR: ${body.prUrl}`;
      else if (body.prError) text += ` (PR notice: ${body.prError})`;
      const revalidateError = await revalidateSite();
      setStatus({ kind: "ok", text: revalidateError ? `${text} (${revalidateError})` : text });
    } catch (err) {
      if (err instanceof ApiConflictError) {
        try {
          const latest = await api<{ sha?: string }>("/api/builder/theme");
          setSha(latest.sha);
          setStatus({
            kind: "error",
            text: "Newer theme on server — review your edits and save again to overwrite.",
          });
        } catch {
          setStatus({ kind: "error", text: err.message });
        }
        return;
      }
      setStatus({ kind: "error", text: err instanceof Error ? err.message : "Save failed" });
    }
  };

  if (!theme) return <p style={{ padding: 24 }}>{status ? "Failed to load." : "Loading…"}</p>;

  return (
    <div>
      <TopBar title="/admin/theme" status={status} />
      <div style={{ display: "flex", gap: 24, padding: 24 }}>
        <div style={{ width: 360 }}>
          <h2 style={{ fontSize: 14, marginBottom: 8 }}>Colors</h2>
          {COLOR_TOKENS.map((token) => (
            <div key={token} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
              <span style={{ width: 90, fontSize: 13 }}>{token}</span>
              {(["light", "dark"] as const).map((mode) => (
                <input
                  key={mode}
                  type="color"
                  title={`${token} ${mode}`}
                  value={theme.colors[token][mode]}
                  onChange={(e) => setColor(token, mode, e.target.value)}
                />
              ))}
            </div>
          ))}
          <h2 style={{ fontSize: 14, margin: "16px 0 8px" }}>Radius + spacing</h2>
          <Field label="Default radius">
            <select
              value={theme.radius.default}
              onChange={(e) =>
                setTheme({ ...theme, radius: { ...theme.radius, default: e.target.value as RadiusKey } })
              }
              style={inputStyle}
            >
              {RADIUS_KEYS.map((k) => (
                <option key={k} value={k}>
                  {k} ({theme.radius[k]})
                </option>
              ))}
            </select>
          </Field>
          <Field label="Spacing density">
            <select
              value={theme.spacing.density}
              onChange={(e) =>
                setTheme({
                  ...theme,
                  spacing: { ...theme.spacing, density: e.target.value as SpacingDensity },
                })
              }
              style={inputStyle}
            >
              {SPACING_DENSITIES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </Field>
          <h2 style={{ fontSize: 14, margin: "16px 0 8px" }}>Typography</h2>
          {(["heading", "body", "mono"] as const).map((role) => (
            <Field key={role} label={role}>
              <select
                value={theme.typography[role]}
                onChange={(e) => setTheme({ ...theme, typography: { ...theme.typography, [role]: e.target.value } })}
                style={inputStyle}
              >
                {CURATED_FONTS.map((f) => (
                  <option key={f.name} value={f.name}>
                    {f.name}
                  </option>
                ))}
              </select>
            </Field>
          ))}
          <button type="button" onClick={() => void save()} style={{ width: "100%", marginTop: 8 }}>
            Save theme
          </button>
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 14, marginBottom: 8 }}>Live preview</h2>
          <ThemeProvider theme={theme}>
            <div className="bg-bld-background text-bld-text" style={{ padding: 24, borderRadius: 8 }}>
              <p className="font-bldBody text-bld-muted" style={{ fontSize: 12 }}>
                Preview — tokens apply instantly
              </p>
              <h3 className="font-bldHeading text-bld-text" style={{ fontSize: 28, margin: "8px 0" }}>
                Heading in {theme.typography.heading}
              </h3>
              <p className="font-bldBody" style={{ marginBottom: 16 }}>
                Body copy in {theme.typography.body}. Muted text follows.
              </p>
              <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                <span className="bg-bld-primary text-bld-background rounded-bld" style={{ padding: "8px 16px" }}>
                  Primary
                </span>
                <span className="bg-bld-accent text-bld-background rounded-bld" style={{ padding: "8px 16px" }}>
                  Accent
                </span>
                <span className="bg-bld-surface text-bld-text rounded-bld" style={{ padding: "8px 16px" }}>
                  Surface
                </span>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {COLOR_TOKENS.map((token) => (
                  <span
                    key={token}
                    title={token}
                    style={{ width: 24, height: 24, borderRadius: 4, backgroundColor: theme.colors[token].light }}
                  />
                ))}
              </div>
            </div>
          </ThemeProvider>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ shared doc editor ------------------------------ */

function SharedEditor({ doc }: { doc: string }) {
  const [puck, setPuck] = useState<PuckData | null>(null);
  const [sha, setSha] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<Status | null>(null);
  const [conflict, setConflict] = useState<{ latestBlocks: number; mineBlocks: number } | null>(null);
  const [confirmLoad, setConfirmLoad] = useState(false);
  const [reloadCount, setReloadCount] = useState(0);
  const latestRef = useRef<{ puck: PuckData; sha?: string } | null>(null);
  const dataRef = useRef<PuckData | null>(null);
  const config = useMemo(() => buildConfig(), []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const body = await api<{ data: unknown; sha?: string }>(
          `/api/builder/shared?doc=${encodeURIComponent(doc)}`,
        );
        if (cancelled) return;
        const loaded = SharedDocSchema.parse(body.data);
        setPuck(loaded.puck);
        setSha(body.sha);
        dataRef.current = loaded.puck;
      } catch (err) {
        if (!cancelled) {
          // Missing docs start blank; the first publish creates them.
          if (err instanceof Error && /not found/i.test(err.message)) {
            const blank: PuckData = { content: [], root: { props: {} }, zones: {} };
            setPuck(blank);
            dataRef.current = blank;
          } else {
            setStatus({ kind: "error", text: err instanceof Error ? err.message : "Load failed" });
          }
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [doc]);

  const handlePublish = async (data: Data) => {
    try {
      const puckData = SharedDocSchema.shape.puck.parse(data);
      const payload = SharedDocSchema.parse({ schemaVersion: 1, puck: puckData });
      const body = await api<{ sha?: string; commitSha?: string; prUrl?: string; prError?: string }>(
        "/api/builder/shared",
        {
          method: "PUT",
          body: JSON.stringify({ doc, data: payload, sha }),
        },
      );
      setSha(body.sha);
      setConflict(null);
      setConfirmLoad(false);
      let text = body.commitSha ? `Published (${body.commitSha.slice(0, 7)})` : "Saved";
      if (body.prUrl) text += ` — review PR: ${body.prUrl}`;
      else if (body.prError) text += ` (PR notice: ${body.prError})`;
      const revalidateError = await revalidateSite();
      setStatus({ kind: "ok", text: revalidateError ? `${text} (${revalidateError})` : text });
    } catch (err) {
      if (err instanceof ApiConflictError) {
        await noteConflict();
        return;
      }
      setStatus({ kind: "error", text: err instanceof Error ? err.message : "Publish failed" });
    }
  };

  const noteConflict = async () => {
    try {
      const latest = await api<{ data: unknown; sha?: string }>(
        `/api/builder/shared?doc=${encodeURIComponent(doc)}`,
      );
      const parsed = SharedDocSchema.parse(latest.data);
      latestRef.current = { puck: parsed.puck, sha: latest.sha };
      setConflict({
        latestBlocks: parsed.puck.content.length,
        mineBlocks: dataRef.current?.content.length ?? 0,
      });
      setConfirmLoad(false);
    } catch (err) {
      setStatus({ kind: "error", text: err instanceof Error ? err.message : "Publish failed" });
    }
  };

  const loadLatest = () => {
    if (!confirmLoad) {
      setConfirmLoad(true);
      return;
    }
    const latest = latestRef.current;
    if (!latest) return;
    setPuck(latest.puck);
    setSha(latest.sha);
    dataRef.current = latest.puck;
    setReloadCount((n) => n + 1);
    setConflict(null);
    setConfirmLoad(false);
    setStatus({ kind: "ok", text: "Loaded the latest published version" });
  };

  return (
    <div>
      <TopBar title={`/admin/shared/${doc}`} status={status} />
      {conflict && (
        <div
          role="alert"
          style={{ background: "#fef3c7", color: "#92400e", padding: "8px 16px", fontSize: 13 }}
        >
          Newer version on server ({conflict.latestBlocks} blocks) vs your unsaved canvas (
          {conflict.mineBlocks} blocks).{" "}
          <button type="button" onClick={loadLatest}>
            {confirmLoad ? "Confirm: discard my changes and load latest" : "Load latest"}
          </button>{" "}
          <button
            type="button"
            onClick={() => {
              setConflict(null);
              setConfirmLoad(false);
            }}
          >
            Keep editing
          </button>
        </div>
      )}
      {!puck ? (
        <p style={{ padding: 24 }}>{status ? "Failed to load." : "Loading…"}</p>
      ) : (
        <div style={{ height: "calc(100vh - 41px)", overflow: "auto" }}>
          <EditingProvider editing={true}>
            <Puck
              key={`${doc}-${reloadCount}`}
              config={config}
              data={puck}
              onChange={(data) => {
                dataRef.current = SharedDocSchema.shape.puck.parse(data);
              }}
              onPublish={(data) => void handlePublish(data)}
            />
          </EditingProvider>
        </div>
      )}
    </div>
  );
}

/* -------------------------------- layouts editor -------------------------------- */

function LayoutsEditor() {
  const [layouts, setLayouts] = useState<LayoutEntry[] | null>(null);
  const [sha, setSha] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<Status | null>(null);
  const [newId, setNewId] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const body = await api<{ data: unknown; sha?: string }>(`/api/builder/shared?doc=layouts`);
        if (cancelled) return;
        setLayouts(LayoutsFileSchema.parse(body.data).layouts);
        setSha(body.sha);
      } catch (err) {
        if (!cancelled) {
          setLayouts(blankLayoutsFile().layouts);
          setStatus({ kind: "error", text: err instanceof Error ? err.message : "Load failed" });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const setRow = (index: number, patch: Partial<LayoutEntry>) => {
    setLayouts((rows) => (rows ? rows.map((r, i) => (i === index ? { ...r, ...patch } : r)) : rows));
  };

  const save = async () => {
    if (!layouts) return;
    try {
      const body = await api<{ sha?: string; prUrl?: string; prError?: string }>("/api/builder/shared", {
        method: "PUT",
        body: JSON.stringify({ doc: "layouts", data: { schemaVersion: 1, layouts }, sha }),
      });
      setSha(body.sha);
      let text = "Layouts saved";
      if (body.prUrl) text += ` — review PR: ${body.prUrl}`;
      else if (body.prError) text += ` (PR notice: ${body.prError})`;
      const revalidateError = await revalidateSite();
      setStatus({ kind: "ok", text: revalidateError ? `${text} (${revalidateError})` : text });
    } catch (err) {
      if (err instanceof ApiConflictError) {
        try {
          const latest = await api<{ data: unknown; sha?: string }>(
            "/api/builder/shared?doc=layouts",
          );
          setSha(latest.sha);
          setStatus({
            kind: "error",
            text: "Newer layouts on server — review your edits and save again to overwrite.",
          });
        } catch {
          setStatus({ kind: "error", text: err.message });
        }
        return;
      }
      setStatus({ kind: "error", text: err instanceof Error ? err.message : "Save failed" });
    }
  };

  if (!layouts) return <p style={{ padding: 24 }}>{status ? "Failed to load." : "Loading…"}</p>;

  return (
    <div>
      <TopBar title="/admin/layouts" status={status} />
      <div style={{ padding: 24, maxWidth: 900 }}>
        {layouts.map((row, i) => (
          <fieldset key={row.id} style={{ border: "1px solid #e2e8f0", borderRadius: 8, padding: 16, marginBottom: 16 }}>
            <legend style={{ fontWeight: 700 }}>{row.id}</legend>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="Display name">
                <input value={row.name} onChange={(e) => setRow(i, { name: e.target.value })} style={inputStyle} />
              </Field>
              <Field label="Shell">
                <select
                  value={row.shell}
                  onChange={(e) => setRow(i, { shell: e.target.value as LayoutEntry["shell"] })}
                  style={inputStyle}
                >
                  <option value="page">Page (linear)</option>
                  <option value="dashboard">Dashboard (sidebar + topbar)</option>
                </select>
              </Field>
              {(
                [
                  ["header", "Header doc"],
                  ["footer", "Footer doc"],
                  ["announcement", "Announcement doc"],
                  ["sidebar", "Sidebar doc (dashboard shell)"],
                ] as const
              ).map(([key, label]) => (
                <Field key={key} label={`${label} (empty = none)`}>
                  <input
                    value={row[key] ?? ""}
                    onChange={(e) => setRow(i, { [key]: e.target.value.trim() || null } as Partial<LayoutEntry>)}
                    placeholder="shared doc name"
                    style={inputStyle}
                  />
                </Field>
              ))}
            </div>
            <button type="button" onClick={() => setLayouts((rows) => (rows ? rows.filter((_, j) => j !== i) : rows))}>
              Remove layout
            </button>
          </fieldset>
        ))}
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <input value={newId} onChange={(e) => setNewId(e.target.value)} placeholder="new-layout-id" style={inputStyle} />
          <button
            type="button"
            onClick={() => {
              const id = newId.trim();
              if (!id || layouts.some((l) => l.id === id)) return;
              setLayouts([
                ...layouts,
                { id, name: id, header: "header", footer: "footer", announcement: null, sidebar: null, shell: "page" },
              ]);
              setNewId("");
            }}
          >
            Add layout
          </button>
        </div>
        <button type="button" onClick={() => void save()}>
          Save layouts
        </button>
      </div>
    </div>
  );
}

/* ----------------------------------- shell ----------------------------------- */

interface AdminEditorProps {
  authRequired?: boolean;
  login?: string | null;
}

function AuthedViews({ path }: { path: string[] }) {
  if (path.length === 0) return <Dashboard />;
  if (path[0] === "theme" && path.length === 1) return <ThemeEditor />;
  if (path[0] === "layouts" && path.length === 1) return <LayoutsEditor />;
  if (path[0] === "shared" && path.length === 2 && path[1] !== "layouts") {
    return <SharedEditor doc={path[1]} />;
  }
  if (path[0] === "page" && path.length === 2) return <PageEditor slug={path[1]} />;
  return (
    <div style={{ padding: 24 }}>
      <p>Unknown editor path.</p>
      <Link href="/admin">Back to pages</Link>
    </div>
  );
}

export default function AdminEditor({ authRequired = false, login = null }: AdminEditorProps) {
  const router = useRouter();
  const segments = router.query.puckPath;
  const path = useMemo(
    () => (Array.isArray(segments) ? segments : segments === undefined ? [] : [segments]),
    [segments],
  );
  const { status: sessionStatus } = useSession();

  if (!router.isReady) return <p style={{ padding: 24 }}>Loading editor…</p>;
  return (
    <BuilderSessionContext.Provider value={{ authRequired, login }}>
      {authRequired && sessionStatus === "loading" ? (
        <p style={{ padding: 24 }}>Checking session…</p>
      ) : authRequired && sessionStatus === "unauthenticated" ? (
        <div style={{ padding: 24 }}>
          <p>Your session expired. Sign in again to keep editing.</p>
          <button type="button" onClick={() => void signIn("github", { callbackUrl: "/admin" })}>
            Sign in with GitHub
          </button>
        </div>
      ) : (
        <AuthedViews path={path} />
      )}
    </BuilderSessionContext.Provider>
  );
}
