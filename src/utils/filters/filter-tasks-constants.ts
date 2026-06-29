import { Task } from "@/core/domain/models";
import { getDailyTasks, getWeekTasks } from "@/utils";

export const ALL_TAGS_FILTER = "all";
export const TODAY_TAGS_FILTER = "today";
export const THIS_WEEK_TAGS_FILTER = "this_week";
export const OVERDUE_TAGS_FILTER = "overdue";
export const COMPLETED_TAGS_FILTER = "completed";
export const UNTAGGED_TAGS_FILTER = "untagged";

export const commonFilters = [
  {
    id: 1,
    text: "All",
    filter: ALL_TAGS_FILTER,
    function: (tasks: Task[]) => tasks,
  },
  {
    id: 2,
    text: "Today",
    filter: TODAY_TAGS_FILTER,
    function: (tasks: Task[]) => getDailyTasks(tasks),
  },
  {
    id: 3,
    text: "Next 7 days",
    filter: THIS_WEEK_TAGS_FILTER,
    function: (tasks: Task[]) => getWeekTasks(tasks),
  },
  {
    id: 4,
    text: "Overdue",
    filter: OVERDUE_TAGS_FILTER,
    function: (tasks: Task[]) => tasks.filter((task) => task.isExpired),
  },
  {
    id: 5,
    text: "Completed",
    filter: COMPLETED_TAGS_FILTER,
    function: (tasks: Task[]) => tasks.filter((task) => task.isCompleted),
  },
] as const;
