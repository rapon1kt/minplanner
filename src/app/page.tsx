import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Header from "@/components/header";
import HomeShell from "@/components/home-shell";
import Footer from "@/components/footer";
import { TaskModel } from "@/infra/db/mongoose/models";
import { connectMongoose } from "@/infra/db/mongoose/mongoose";
import sortTasks from "@/utils/sorters/sort-tasks";

export default async function Home() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  async function getTasks() {
    "use server";
    await connectMongoose();
    const tasks = await TaskModel.find({
      userId: session!.user.id,
    }).lean();
    return JSON.parse(JSON.stringify(sortTasks(tasks)));
  }

  const tasks = await getTasks();

  return (
    <div className="transition-all min-h-screen bg-neutral-950 text-neutral-100">
      <div className="max-w-6xl mx-auto min-h-screen border-l border-r border-neutral-800">
        <Header session={session} />
        <HomeShell tasks={tasks} />
      </div>
      <Footer />
    </div>
  );
}
