import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (session && session.user) {
    redirect("/");
  }

  return <div>{children}</div>;
}
