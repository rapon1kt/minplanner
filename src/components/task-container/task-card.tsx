import { deleteTask, updateTask } from "@/actions/task/form-actions";
import { Task } from "@/core/domain/models";
import { dateFormatter } from "@/utils";
import { CheckCircle2, Circle, Skull, Trash2 } from "lucide-react";

const severityTextColor = {
  low: "text-green-800",
  medium: "text-amber-800",
  high: "text-red-800",
} as const;

type SeverityType = "low" | "medium" | "high";

const returnSeverityStyle = (severity: SeverityType) => {
  return severityTextColor[severity];
};

const capitalizeStr = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);

export default function TaskCard({ task }: { task: Task }) {
  return (
    <div className="group flex items-center gap-4 p-4 bg-neutral-900/20 rounded-sm border border-neutral-800 hover:border-neutral-700 transition-all hover:bg-neutral-900/50">
      <form action={updateTask}>
        <input type="hidden" name="taskId" value={task._id?.toString()} />
        <input
          type="hidden"
          name="isCompleted"
          value={String(!task.isCompleted)}
        />
        <button
          type="submit"
          aria-label={
            task.isCompleted ? "Mark task as pending" : "Complete task"
          }
          className="cursor-pointer shrink-0 transition-colors"
        >
          {task.isCompleted ? (
            <CheckCircle2 size={24} className="text-green-900" />
          ) : (
            <Circle
              size={24}
              className="text-neutral-700 group-hover:text-neutral-600"
            />
          )}
        </button>
      </form>
      <div className="flex-1">
        <div className="flex space-x-2 items-center">
          <p
            className={`flex text-lg items-center gap-2 font-barlow transition-all ${task.isCompleted ? "line-through text-neutral-500" : "text-neutral-400"}`}
          >
            {task.title}
          </p>
          <span className="text-neutral-400">•</span>
          {task.severity && (
            <p
              className={`font-barlow ${returnSeverityStyle(task.severity as SeverityType)}`}
            >
              {capitalizeStr(task.severity)}
            </p>
          )}
        </div>
        <p className="font-barlow text-neutral-500">{task.description}</p>
        {task.dueDate ? (
          <p className="font-barlow font-extralight text-neutral-400 mt-1">
            {dateFormatter(task.dueDate)}
          </p>
        ) : (
          <p className="font-barlow font-extralight items-center flex gap-2 text-xs text-neutral-400 mt-1">
            For eternity <Skull className="text-red-900" size={14} />
          </p>
        )}
      </div>
      <form action={deleteTask}>
        <input type="hidden" name="taskId" value={task._id?.toString()} />
        <button
          type="submit"
          aria-label="Delete task"
          className="cursor-pointer shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-neutral-600 hover:text-red-900"
        >
          <Trash2 size={18} />
        </button>
      </form>
    </div>
  );
}
