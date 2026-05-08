import { MongoDBAdapter } from "@auth/mongodb-adapter";
import Github from "next-auth/providers/github";
import NextAuth from "next-auth";
import client, { databaseName } from "./db";

const githubClientId = process.env.AUTH_GITHUB_ID ?? process.env.GITHUB_ID;
const githubClientSecret =
  process.env.AUTH_GITHUB_SECRET ?? process.env.GITHUB_SECRET;

if (!githubClientId || !githubClientSecret) {
  throw new Error("Missing GitHub OAuth credentials");
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: MongoDBAdapter(client, { databaseName }),
  providers: [
    Github({
      clientId: githubClientId,
      clientSecret: githubClientSecret,
      profile(profile) {
        return {
          id: String(profile.id ?? profile.login),
          name: profile.name ?? profile.login,
          email: profile.email,
          image: profile.avatar_url,
        };
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
    signOut: "/sign-out",
  },
});
