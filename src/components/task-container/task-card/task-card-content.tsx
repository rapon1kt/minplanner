import {
  capitalizeStr,
  getSeverityTextColor,
  isSeverityType,
} from "./task-card-utils";
import { dateFormatter } from "@/utils";
import type { Task } from "@/core/domain/models";
import { AlarmClock, Skull } from "lucide-react";

export default function TaskCardContent({ task }: { task: Task }) {
  const severity = isSeverityType(task.severity) ? task.severity : undefined;
  const formattedDueDate = task.dueDate ? dateFormatter(task.dueDate) : "";
  const today = dateFormatter(new Date().toString());
  const dueDateLabel = formattedDueDate === today ? "Today" : formattedDueDate;

  return (
    <div className="min-w-0 flex-1 space-y-2">
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
      {task.dueDate ? (
        <p
          className={`font-barlow flex ${task.isExpired && "text-red-500/60"} items-center gap-2 text-xs font-extralight text-neutral-400 mt-1`}
        >
          <AlarmClock size={18} />
          {dueDateLabel}
        </p>
      ) : (
        <p className="font-barlow font-extralight items-center flex gap-2 text-xs text-neutral-400 mt-1">
          For eternity <Skull className="text-red-900" size={14} />
        </p>
      )}
    </div>
  );
}
