import dynamic from "next/dynamic";

/**
 * Builder admin (M3). The Puck editor touches browser APIs, so the shell
 * loads client-only. Auth gating for `/admin` arrives with M7; the API
 * routes already enforce the dev-bypass guard.
 */
const AdminEditor = dynamic(() => import("@/builder/editor/admin-editor"), {
  ssr: false,
  loading: () => <p style={{ padding: 24 }}>Loading editor…</p>,
});

export default function AdminPage() {
  return <AdminEditor />;
}
