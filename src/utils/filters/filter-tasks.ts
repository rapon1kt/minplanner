import { getValueId } from "../record-id";
import { Task } from "@/core/domain/models";
import { commonFilters, UNTAGGED_TAGS_FILTER } from "./filter-tasks-constants";

export const isToday = (dueDateString: string | undefined): boolean => {
  if (!dueDateString) return false;
  return new Date(dueDateString).toDateString() === new Date().toDateString();
};

export const getDailyTasks = (tasks: Task[]): Task[] => {
  return tasks.filter((task) => isToday(task.dueDate) && !task.isExpired);
};

export const getWeekTasks = (tasks: Task[]): Task[] => {
  const now = new Date();

  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);

  return tasks.filter((task) => {
    if (!task.dueDate) return;
    const taskDate = new Date(task.dueDate);
    return +taskDate >= +startOfWeek && +taskDate < +endOfWeek;
  });
};

export const filterTasksByTag = (
  tasks: Task[],
  selectedTagId: string,
): Task[] => {
  const filter = commonFilters.find(
    (commonFilter) => commonFilter.filter === selectedTagId,
  );

  if (filter) return filter.function(tasks);

  return tasks.filter((task) => {
    const taskTagIds = task.tags?.map(getValueId) ?? [];

    if (selectedTagId === UNTAGGED_TAGS_FILTER) {
      return taskTagIds.length === 0;
    }

    return taskTagIds.includes(selectedTagId);
  });
};
