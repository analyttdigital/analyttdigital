import type { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

/**
 * Builder auth (M7). GitHub OAuth via next-auth v4. The GitHub *login* is
 * threaded through the JWT into the session so the builder guard can check
 * the allowlist / repo permission without extra profile fetches.
 */

interface LoginToken {
  login?: string;
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers:
    process.env.GITHUB_ID && process.env.GITHUB_SECRET
      ? [
          GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
          }),
        ]
      : [],
  callbacks: {
    async jwt({ token, profile }) {
      const login = (profile as { login?: unknown } | undefined)?.login;
      if (typeof login === "string") (token as LoginToken).login = login;
      return token;
    },
    async session({ session, token }) {
      const login = (token as LoginToken).login;
      if (typeof login === "string" && session.user) {
        (session.user as { login?: string }).login = login;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
