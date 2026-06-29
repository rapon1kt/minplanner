"use server";
import { signOut } from "@/lib/auth";

export default async function handleSignOut() {
  await signOut({ redirectTo: "/sign-in" });
}
