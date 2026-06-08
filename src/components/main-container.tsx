import { Tag, Task } from "@/core/domain/models";
import TaskContainer from "./task-container/task-container";
import Loading from "./loading";
import TagContainer from "./tag-container/tag-container";

export default function MainContainer({
  activeTab,
  tags,
  tasks,
}: {
  activeTab: string;
  tags: Tag[];
  tasks: Task[];
}) {
  switch (activeTab) {
    case "tasks":
      return <TaskContainer tasks={tasks} tags={tags} />;
    case "tags":
      return <TagContainer tags={tags} />;
    // To do:
    // - Implement Calendar-Container to see Tasks
    default:
      return <Loading />;
  }
}
