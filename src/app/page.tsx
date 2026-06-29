import { auth } from "@/lib/auth";
import { homeService } from "@/services";
import { redirect } from "next/navigation";
import { Footer, Header, HomeShell } from "@/components";

export default async function Home() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const { tasks, tags } = await homeService.getHomeData(session.user.id);

  return (
    <div className="transition-all min-h-screen bg-neutral-950 text-neutral-100">
      <div className="max-w-6xl mx-auto min-h-screen border-l border-r border-neutral-800">
        <Header session={session} />
        <HomeShell tasks={tasks} tags={tags} />
      </div>
      <Footer />
    </div>
  );
}
