import { Task } from "@/core/domain/models";

const sortByCompletedStatus = (a: Task, b: Task): number =>
  Number(a.isCompleted) - Number(b.isCompleted);

const sortByDueDate = (a: Task, b: Task): number => {
  if (a.dueDate && b.dueDate) {
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  }
  return 0;
};

const sortBySeverityType = (a: Task, b: Task): number => {
  if (a.severity && b.severity) {
    const sevNum = {
      low: 0,
      medium: 1,
      high: 2,
    } as const;
    return (
      sevNum[b.severity as keyof typeof sevNum] -
      sevNum[a.severity as keyof typeof sevNum]
    );
  }
  return 0;
};

const sortByTitle = (a: Task, b: Task): number =>
  a.title.localeCompare(b.title);

export default function sortTasks(tasks: Task[]) {
  return tasks.sort((a: Task, b: Task) => {
    return (
      sortByCompletedStatus(a, b) ||
      sortBySeverityType(a, b) ||
      sortByDueDate(a, b) ||
      sortByTitle(a, b)
    );
  }) as Task[];
}
