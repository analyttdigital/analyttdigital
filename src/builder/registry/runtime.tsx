import dynamic from "next/dynamic";
import { createElement, useEffect, useState } from "react";
import type { ComponentType, ReactNode } from "react";

import { useEditing } from "@/builder/render/editing";

/**
 * M5 render wrapping: prop validation + `editing` injection, with an
 * optional client-only shell. Heavy components (gsap, three.js) must still
 * `import()` their libraries lazily inside — this shell only guarantees they
 * never execute during SSR/prerender.
 */

export function withBuilderRuntime<P extends Record<string, unknown>>(
  render: ComponentType<P & { editing?: boolean }>,
  validate: (saved: unknown) => P,
): ComponentType<P> {
  return function BuilderRuntime(props: P) {
    const editing = useEditing();
    const validated = validate(props);
    return createElement(render, { ...validated, editing });
  };
}

export function clientOnly<P extends Record<string, unknown>>(
  render: ComponentType<P>,
  loading?: ReactNode,
): ComponentType<P> {
  const ClientShell = dynamic(() => Promise.resolve({ default: render }), {
    ssr: false,
    loading: () =>
      (loading ??
      createElement("div", { className: "font-bldBody text-bld-muted text-sm" }, "Loading…")),
  });
  // Mount-gated fallback: if `dynamic` ever resolves on the server path
  // (tests, static export), render the placeholder instead of crashing.
  return function ClientOnlyWrapper(props: P) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
      setMounted(true);
    }, []);
    if (!mounted) {
      return createElement("div", { className: "font-bldBody text-bld-muted text-sm" }, "Loading…");
    }
    return createElement(ClientShell, props);
  };
}
