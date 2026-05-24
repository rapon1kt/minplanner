import { Task } from "@/core/domain/models";
import TaskContainer from "./task-container/task-container";
import Loading from "./loading";

export default function MainContainer({
  activeTab,
  tasks,
}: {
  activeTab: string;
  tasks: Task[];
}) {
  switch (activeTab) {
    case "tasks":
      return <TaskContainer tasks={tasks} />;
    // To do:
    // - Implement Calendar-Container to see Tasks
    default:
      return <Loading />;
  }
}
