import Link from "next/link";

export default function Footer() {
  return (
    <footer className="p-4 text-center border-b-0 max-w-6xl border border-neutral-800 mx-auto font-space text-neutral-400">
      Made by{" "}
      <Link className="text-red-900" href="https://www.github.com/rapon1kt">
        rapon1kt
      </Link>
    </footer>
  );
}
