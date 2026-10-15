"use server";
import { isConfiguredAuthProvider, signIn, signOut } from "@/lib/auth";
import { getSafeCallbackUrl } from "@/utils/auth/auth";
import { redirect } from "next/navigation";

export async function handleSignOut() {
  await signOut({ redirectTo: "/sign-in" });
}

export async function handleSignIn(formData: FormData) {
  "use server";
  const provider = formData.get("provider")?.toString();
  const callbackUrl = getSafeCallbackUrl(
    formData.get("callbackUrl")?.toString(),
  );

  if (!isConfiguredAuthProvider(provider)) {
    const errorParams = new URLSearchParams({
      callbackUrl,
      error: "InvalidProvider",
    });

    redirect(`/sign-in?${errorParams.toString()}`);
  }

  await signIn(provider, { redirectTo: callbackUrl });
}
