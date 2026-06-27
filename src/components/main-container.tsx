import { Tag, Task } from "@/core/domain/models";
import {
  TaskContainer,
  TagContainer,
  CalendarContainer,
  Loading,
} from "@/components";

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
    case "calendar":
      return <CalendarContainer tasks={tasks} tags={tags} />;
    default:
      return <Loading />;
  }
}
