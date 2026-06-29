import handleSignOut from "@/actions/auth/auth";
import { LogOut } from "lucide-react";
import { Session } from "next-auth";

interface HeaderProps {
  session: Session;
}

export default function Header({ session }: HeaderProps) {
  return (
    <header className="flex justify-between items-center border-b border-neutral-800">
      <div className="px-6 py-8">
        <h1 className="font-barlow text-red-900 text-5xl tracking-tight mb-2">
          MinPlanner
        </h1>
        <p className="text-start font-barlow text-neutral-400 text-xs tracking-widest">
          Welcome, {session.user.name}!
        </p>
      </div>
      <form
        action={handleSignOut}
        className="flex space-x-4 items-center px-6 py-8"
      >
        <button
          type="submit"
          className="font-barlow cursor-pointer flex gap-2 items-center text-sm text-neutral-400"
        >
          <LogOut strokeWidth={1} cursor="pointer" size={16} />
          Log Out
        </button>
      </form>
    </header>
  );
}
