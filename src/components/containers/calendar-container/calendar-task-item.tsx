import type { Tag, Task } from "@/core/domain/models";
import { getRecordId, getValueId } from "@/utils";
import { getShortDateLabel } from "./calendar-utils";

type CalendarTaskItemProps = {
  tags: Tag[];
  task: Task;
};

function getTaskStateLabel(task: Task) {
  if (task.isExpired) return "Overdue";
  if (task.isCompleted) return "Done";
  return "Pending";
}

function getTaskStateClassName(task: Task) {
  if (task.isExpired) return "border-red-800/50 bg-red-900/10 text-red-500/80";
  if (task.isCompleted) {
    return "border-green-800/50 bg-green-900/10 text-green-700";
  }
  return "border-neutral-800 bg-neutral-900 text-neutral-500";
}

export default function CalendarTaskItem({
  tags,
  task,
}: CalendarTaskItemProps) {
  const taskTagIds = new Set(task.tags?.map(getValueId) ?? []);
  const taskTags = tags.filter((tag) => taskTagIds.has(getRecordId(tag)));

  return (
    <div className="rounded-sm border border-neutral-800 bg-neutral-900/20 p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p
            className={`truncate font-barlow text-sm ${
              task.isCompleted
                ? "text-neutral-500 line-through"
                : "text-neutral-300"
            }`}
          >
            {task.title}
          </p>
          <p className="mt-0.5 font-barlow text-xs text-neutral-600">
            {getShortDateLabel(task.dueDate)}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full border px-2 py-0.5 font-barlow text-[10px] ${getTaskStateClassName(
            task,
          )}`}
        >
          {getTaskStateLabel(task)}
        </span>
      </div>

      {taskTags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {taskTags.map((tag) => (
            <span
              className="inline-flex items-center gap-1 rounded-sm border border-neutral-800 px-2 py-0.5 font-barlow text-[10px] text-neutral-500"
              key={getRecordId(tag)}
            >
              <span
                className="size-1.5 rounded-full"
                style={{ backgroundColor: tag.color }}
              />
              {tag.title}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
