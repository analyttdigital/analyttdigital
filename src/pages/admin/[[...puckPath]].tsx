import type { GetServerSideProps } from "next";
import dynamic from "next/dynamic";

/**
 * Builder admin (M3). The Puck editor touches browser APIs, so the shell
 * loads client-only. (M7) Production requires a GitHub session: unauthenticated
 * visits redirect to sign-in. Server-only imports stay inside
 * `getServerSideProps` (dynamic) so the client bundle stays lean.
 */
const AdminEditor = dynamic(() => import("@/builder/editor/admin-editor"), {
  ssr: false,
  loading: () => <p style={{ padding: 24 }}>Loading editor…</p>,
});

interface AdminPageProps {
  authRequired: boolean;
  login: string | null;
}

export const getServerSideProps: GetServerSideProps<AdminPageProps> = async ({ req, res }) => {
  const { isDevBypass, sessionLogin } = await import("@/builder/auth/guard");
  if (isDevBypass()) return { props: { authRequired: false, login: null } };
  const { getServerSession } = await import("next-auth/next");
  const { authOptions } = await import("@/pages/api/auth/[...nextauth]");
  const session = await getServerSession(req, res, authOptions);
  const login = sessionLogin(session);
  if (!login) {
    return {
      redirect: { destination: "/api/auth/signin?callbackUrl=/admin", permanent: false },
    };
  }
  return { props: { authRequired: true, login } };
};

export default function AdminPage({ authRequired, login }: AdminPageProps) {
  return <AdminEditor authRequired={authRequired} login={login} />;
}
