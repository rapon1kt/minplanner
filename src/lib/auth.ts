import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import client, { databaseName } from "./db";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth";
import type { Provider } from "next-auth/providers";
import { MongoDBAdapter } from "@auth/mongodb-adapter";

import type { TokenSet } from "@auth/core/types";

type AuthProviderId = "google" | "github";

type AuthProviderMetadata = {
  id: AuthProviderId;
  name: string;
  description: string;
  configured: boolean;
};

type OAuthCredentials = {
  clientId: string;
  clientSecret: string;
};

type GitHubEmail = {
  email: string;
  primary: boolean;
  verified: boolean;
};

type GitHubProfile = {
  id: number | string;
  login: string;
  name?: string | null;
  email?: string | null;
  avatar_url?: string | null;
  email_verified?: boolean;
};

const githubCredentials = getOAuthCredentials("GITHUB");
const googleCredentials = getOAuthCredentials("GOOGLE");

export const authProviders: AuthProviderMetadata[] = [
  {
    id: "google",
    name: "Google",
    description: "Use a verified Google account.",
    configured: Boolean(googleCredentials),
  },
  {
    id: "github",
    name: "GitHub",
    description: "Use a GitHub account with a verified email.",
    configured: Boolean(githubCredentials),
  },
];

export const configuredAuthProviders = authProviders.filter(
  (provider) => provider.configured,
);

export function isConfiguredAuthProvider(
  provider: unknown,
): provider is AuthProviderId {
  return (
    typeof provider === "string" &&
    configuredAuthProviders.some(({ id }) => id === provider)
  );
}

function getOAuthCredentials(provider: "GITHUB" | "GOOGLE") {
  const clientId =
    process.env[`AUTH_${provider}_ID`] ?? process.env[`${provider}_ID`];
  const clientSecret =
    process.env[`AUTH_${provider}_SECRET`] ?? process.env[`${provider}_SECRET`];

  if (!clientId || !clientSecret) return null;

  return { clientId, clientSecret } satisfies OAuthCredentials;
}

async function fetchGitHubProfile(accessToken: string) {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "User-Agent": "minplanner",
    Accept: "application/vnd.github+json",
  };

  const profileResponse = await fetch("https://api.github.com/user", {
    headers,
  });

  if (!profileResponse.ok) {
    throw new Error("Unable to fetch GitHub profile.");
  }

  const profile = (await profileResponse.json()) as GitHubProfile;

  const emailsResponse = await fetch("https://api.github.com/user/emails", {
    headers,
  });

  if (!emailsResponse.ok) {
    return { ...profile, email: null, email_verified: false };
  }

  const emails = (await emailsResponse.json()) as GitHubEmail[];
  const verifiedEmail =
    emails.find((email) => email.primary && email.verified) ??
    emails.find((email) => email.verified && email.email === profile.email) ??
    emails.find((email) => email.verified);

  return {
    ...profile,
    email: verifiedEmail?.email ?? null,
    email_verified: Boolean(verifiedEmail),
  };
}

function createProviders() {
  const providers: Provider[] = [];

  if (googleCredentials) {
    providers.push(
      Google({
        ...googleCredentials,
        allowDangerousEmailAccountLinking: true,
      }),
    );
  }

  if (githubCredentials) {
    providers.push(
      Github({
        ...githubCredentials,
        allowDangerousEmailAccountLinking: true,
        userinfo: {
          url: "https://api.github.com/user",
          async request({ tokens }: { tokens: TokenSet }) {
            if (!tokens.access_token) {
              throw new Error("Missing GitHub access token.");
            }

            return fetchGitHubProfile(tokens.access_token);
          },
        },
        profile(profile: GitHubProfile) {
          return {
            id: String(profile.id),
            name: profile.name ?? profile.login,
            email: profile.email,
            image: profile.avatar_url,
          };
        },
      }),
    );
  }

  if (providers.length === 0) {
    throw new Error(
      "Missing OAuth credentials. Configure GitHub or Google before starting authentication.",
    );
  }

  return providers;
}

const authConfig = {
  adapter: MongoDBAdapter(client, { databaseName }),
  providers: createProviders(),
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google" && profile?.email_verified !== true) {
        return "/sign-in?error=EmailNotVerified";
      }

      if (account?.provider === "github" && !profile?.email) {
        return "/sign-in?error=EmailNotVerified";
      }

      return true;
    },
    async session({ session, token, user }) {
      if (session.user) {
        session.user.id = user?.id ?? token?.sub ?? session.user.id;
      }

      return session;
    },
    authorized({ auth, request }) {
      const { pathname, search } = request.nextUrl;
      const isSignInPage = pathname.startsWith("/sign-in");

      if (isSignInPage && auth?.user) {
        return NextResponse.redirect(new URL("/", request.nextUrl));
      }

      if (!auth?.user && !isSignInPage) {
        const signInUrl = new URL("/sign-in", request.nextUrl);
        signInUrl.searchParams.set("callbackUrl", `${pathname}${search}`);
        return NextResponse.redirect(signInUrl);
      }

      return true;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
