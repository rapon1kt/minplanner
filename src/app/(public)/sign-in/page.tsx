import { authProviders, isConfiguredAuthProvider, signIn } from "@/lib/auth";
import { ProviderIcon } from "@/components/provider-icon";
import {
  SignInSearchParams,
  getAuthMessage,
  getFirstSearchParam,
  getSafeCallbackUrl,
} from "@/utils/auth/auth";
import { redirect } from "next/navigation";

type SignInProps = {
  searchParams?: Promise<SignInSearchParams>;
};

export default async function SignIn({ searchParams }: SignInProps) {
  const params = await searchParams;
  const callbackUrl = getSafeCallbackUrl(
    getFirstSearchParam(params?.callbackUrl),
  );
  const authMessage = getAuthMessage(getFirstSearchParam(params?.error));

  const configuredProviders = authProviders.filter(
    (provider) => provider.configured,
  );

  async function handleSignIn(formData: FormData) {
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

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-neutral-950 px-6 py-10 text-neutral-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(127,29,29,0.34),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(64,64,64,0.28),transparent_34%)]" />
      <div className="absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-linear-to-r from-transparent via-red-900/70 to-transparent" />

      <main className="relative w-full max-w-md">
        <div className="mb-3 text-center">
          <p className="mb-3 font-barlow text-xs uppercase text-red-900">
            MinPlanner
          </p>
          <h1 className="font-space text-5xl tracking-tight text-neutral-100">
            Login
          </h1>
          <p className="mt-3 font-barlow text-sm leading-6 text-neutral-400">
            Organize your routine with a secure account tied to a verified
            identity provider.
          </p>
        </div>

        <section className="p-3">
          {authMessage && (
            <div
              role="alert"
              className="mb-5 rounded-2xl border border-red-950/80 bg-red-950/20 p-4"
            >
              <p className="font-space text-sm text-red-100">
                {authMessage.title}
              </p>
              <p className="mt-1 font-barlow text-sm leading-5 text-red-100/70">
                {authMessage.description}
              </p>
            </div>
          )}

          {configuredProviders.length > 0 ? (
            <div className="space-y-3">
              {configuredProviders.map((provider) => (
                <form key={provider.id} action={handleSignIn}>
                  <input type="hidden" name="provider" value={provider.id} />
                  <input type="hidden" name="callbackUrl" value={callbackUrl} />
                  <button className="group flex w-full cursor-pointer items-center justify-between rounded-lg border border-neutral-800 bg-neutral-900/40 px-4 py-3 text-left transition hover:border-neutral-700 hover:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-red-950">
                    <span className="flex items-center gap-3">
                      <span className="flex size-10 items-center justify-center rounded-sm border border-neutral-800 bg-neutral-950 text-neutral-100 transition group-hover:border-neutral-700">
                        <ProviderIcon provider={provider.id} />
                      </span>
                      <span>
                        <span className="block font-barlow text-sm font-medium text-neutral-100">
                          Continue with {provider.name}
                        </span>
                        <span className="mt-0.5 block font-barlow text-xs text-neutral-500">
                          {provider.description}
                        </span>
                      </span>
                    </span>
                  </button>
                </form>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-amber-900/60 bg-amber-950/20 p-4">
              <p className="font-space text-sm text-amber-100">
                No sign-in providers are configured.
              </p>
              <p className="mt-1 font-barlow text-sm leading-5 text-amber-100/70">
                Add GitHub or Google OAuth credentials before signing in.
              </p>
            </div>
          )}

          <p className="mt-5 border-t border-neutral-900 pt-4 font-barlow text-xs leading-5 text-neutral-500">
            MinPlanner only stores the identity data needed to recognize your
            account. We will NEVER ask for any additional information without
            your consent.
          </p>
        </section>
      </main>
    </div>
  );
}
