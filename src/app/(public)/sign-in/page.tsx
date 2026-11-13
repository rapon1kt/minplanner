import { handleSignIn } from "@/actions/auth/auth";
import { ProviderIcon } from "@/components/icons/provider-icon";
import { authProviders } from "@/lib/auth";
import {
  SignInSearchParams,
  getAuthMessage,
  getFirstSearchParam,
  getSafeCallbackUrl,
} from "@/utils/auth/auth";
import Link from "next/link";

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

  return (
    <main className="flex flex-col items-center h-dvh">
      <section className="flex-1 flex flex-col justify-center gap-4">
        <div className="w-100 space-y-4">
          <h1 className="text-4xl font-medium font-rubik underline">Login</h1>
          <p className="text-neutral-800">
            Organize your routine with a secure account tied to a verified
            identity provider.
          </p>
        </div>
        {authMessage && (
          <div
            role="alert"
            className="mb-2 w-100 border border-black/10 p-2 rounded-md"
          >
            <p className="text-sm font-medium">{authMessage.title}</p>
            <p className="mt-1 text-sm leading-5 text-neutral-800">
              {authMessage.description}
            </p>
          </div>
        )}
        {configuredProviders.length > 0 ? (
          <div className="space-y-3 w-100">
            {configuredProviders.map((provider) => (
              <form key={provider.id} action={handleSignIn}>
                <input type="hidden" name="provider" value={provider.id} />
                <input type="hidden" name="callbackUrl" value={callbackUrl} />
                <button className="flex w-100 text-start p-3 transition-all cursor-pointer border border-black/10 hover:bg-black/8 rounded-lg">
                  <span className="flex items-center gap-3">
                    <span className="mx-2">
                      <ProviderIcon provider={provider.id} />
                    </span>
                    <span className="flex flex-col">
                      <span className="font-medium">
                        Continue with {provider.name}
                      </span>
                      <span className="text-sm text-neutral-600">
                        {provider.description}
                      </span>
                    </span>
                  </span>
                </button>
              </form>
            ))}
          </div>
        ) : (
          <div className="w-100 border border-black/10 p-2 rounded-sm">
            <p className="font-medium font-rubik">
              No sign-in providers are configured.
            </p>
            <p className="text-neutral-800 text-sm">
              Please try reloading the page. If the error persists, contact our{" "}
              <Link
                className="underline text-blue-500"
                href="https://github.com/rapon1kt/minplanner/issues"
              >
                support team
              </Link>
              .
            </p>
          </div>
        )}
        <p className="w-100 text-justify text-xs text-neutral-600">
          MinPlanner only stores the identity data needed to recognize your
          account. We will NEVER ask for any additional information without your
          consent.
        </p>
      </section>
      <footer className="text-xs py-4">
        &copy; {new Date().getFullYear()} MinPlanner
      </footer>
    </main>
  );
}
