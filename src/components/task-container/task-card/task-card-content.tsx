import {
  capitalizeStr,
  getSeverityTextColor,
  isSeverityType,
} from "./task-card-utils";
import { dateFormatter, getRecordId, getValueId } from "@/utils";
import type { Tag, Task } from "@/core/domain/models";
import { AlarmClock, Skull } from "lucide-react";

export default function TaskCardContent({
  tags,
  task,
}: {
  tags: Tag[];
  task: Task;
}) {
  const severity = isSeverityType(task.severity) ? task.severity : undefined;
  const formattedDueDate = task.dueDate ? dateFormatter(task.dueDate) : "";
  const today = dateFormatter(new Date().toString());
  const dueDateLabel = formattedDueDate === today ? "Today" : formattedDueDate;
  const taskTagIds = new Set(task.tags?.map(getValueId) ?? []);
  const taskTags = tags.filter((tag) => taskTagIds.has(getRecordId(tag)));

  return (
    <div className="min-w-0 flex-1 space-y-0.5">
      <div>
        <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
          <p
            className={`min-w-0 max-w-full wrap-anywhere text-lg font-barlow transition-all ${task.isCompleted ? "line-through text-neutral-500" : "text-neutral-300"}`}
          >
            {task.title}
          </p>
          {severity && (
            <>
              <span className="text-neutral-400">-</span>
              <p className={`font-barlow ${getSeverityTextColor(severity)}`}>
                {capitalizeStr(severity)}
              </p>
            </>
          )}
        </div>
        <p className="max-w-full wrap-anywhere font-barlow text-neutral-500">
          {task.description}
        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-end gap-2">
        {task.dueDate ? (
          <p
            className={`font-barlow flex ${task.isExpired && "text-red-500/60"} items-center gap-2 text-xs font-extralight text-neutral-400 mt-1`}
          >
            <AlarmClock size={18} />
            {dueDateLabel}
          </p>
        ) : (
          <p
            className={`font-barlow font-extralight items-center flex gap-2 text-xs text-neutral-400 ${task.description.length == 0 ? "mt-0" : "mt-1"}`}
          >
            For eternity <Skull className="text-red-900" size={14} />
          </p>
        )}
        {task.tags?.length != 0 && (
          <span className="hidden sm:block text-neutral-400">•</span>
        )}
        {taskTags.length > 0 && (
          <div className="sm:flex grid grid-cols-2 gap-1.5">
            {taskTags.map((tag) => (
              <span
                key={getRecordId(tag)}
                className="inline-flex items-center rounded-sm border border-neutral-800 gap-1 px-2 font-barlow text-xs text-neutral-400"
              >
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: tag.color }}
                />
                {tag.title}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
