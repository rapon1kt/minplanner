import { signIn } from "@/lib/auth";

export default async function SignIn() {
  const handleSignIn = async () => {
    "use server";
    await signIn("github");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-neutral-950">
      <div className="space-y-4 max-w-100">
        <div className="flex flex-col text-center gap-1">
          <h1 className="text-neutral-200 mb-2 text-5xl font-space">Login</h1>
          <p className="text-neutral-500 text-sm font-normal font-barlow">
            Welcome to <span className="text-red-900">MinPlanner</span>, please
            sign in to organize your routine.
          </p>
        </div>
        <form action={handleSignIn}>
          <button className="hover:bg-neutral-900 cursor-pointer flex items-center justify-center gap-2 font-barlow font-thin w-full border border-neutral-800 text-neutral-200 py-1.5 rounded-md">
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
            Login with GitHub
          </button>
        </form>
      </div>
    </div>
  );
}
