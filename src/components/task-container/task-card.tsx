import { deleteTask, updateTask } from "@/actions/task/form-actions";
import { Task } from "@/core/domain/models";
import { dateFormatter } from "@/utils";
import {
  AlarmClock,
  RefreshCcw,
  Skull,
  Square,
  SquareCheck,
  Trash2,
} from "lucide-react";

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

const renewTaskToToday = (): string => {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return today.toString();
};

export default function TaskCard({ task }: { task: Task }) {
  return (
    <div className="group flex w-full flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-neutral-900/20 rounded-sm border border-neutral-800 hover:border-neutral-700 transition-all hover:bg-neutral-900/50">
      <div className="hidden flex-col h-full sm:flex items-start sm:items-center gap-2">
        {task.isExpired ? (
          <form className="flex" action={updateTask}>
            <input type="hidden" name="taskId" value={task._id?.toString()} />
            <input type="hidden" name="isExpired" value="false" />
            <input type="hidden" name="dueDate" value={renewTaskToToday()} />
            <button
              type="submit"
              className="cursor-pointer shrink-0 transition-colors"
            >
              <RefreshCcw
                size={24}
                className="text-neutral-700 group-hover:text-neutral-600 hover:text-indigo-900"
              />
            </button>
          </form>
        ) : (
          <form className="flex" action={updateTask}>
            <input type="hidden" name="taskId" value={task._id?.toString()} />
            <input
              type="hidden"
              name="isCompleted"
              value={String(!task.isCompleted)}
            />
            <button
              type="submit"
              className="cursor-pointer shrink-0 transition-colors"
            >
              {task.isCompleted ? (
                <SquareCheck size={24} className="text-green-900" />
              ) : (
                <Square
                  size={24}
                  className="text-neutral-700 hover:text-green-900 group-hover:text-neutral-600"
                />
              )}
            </button>
          </form>
        )}
      </div>
      <div className="min-w-0 flex-1 space-y-2">
        <div>
          <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
            <p
              className={`min-w-0 max-w-full wrap-anywhere text-lg font-barlow transition-all ${task.isCompleted ? "line-through text-neutral-500" : "text-neutral-300"}`}
            >
              {task.title}
            </p>
            {task.severity && (
              <>
                <span className="text-neutral-400">•</span>
                <p
                  className={`font-barlow ${returnSeverityStyle(task.severity as SeverityType)}`}
                >
                  {capitalizeStr(task.severity)}
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
            {dateFormatter(task.dueDate) == dateFormatter(new Date().toString())
              ? "Today"
              : dateFormatter(task.dueDate)}
          </p>
        ) : (
          <p className="font-barlow font-extralight items-center flex gap-2 text-xs text-neutral-400 mt-1">
            For eternity <Skull className="text-red-900" size={14} />
          </p>
        )}
      </div>
      <form className="hidden sm:block" action={deleteTask}>
        <input type="hidden" name="taskId" value={task._id?.toString()} />
        <button
          type="submit"
          aria-label="Delete task"
          className="cursor-pointer shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-neutral-600 hover:text-red-900"
        >
          <Trash2 size={18} />
        </button>
      </form>
      <div className="flex gap-2 w-full sm:hidden">
        <form
          hidden={!task.isExpired}
          className="flex flex-1"
          action={updateTask}
        >
          <input type="hidden" name="taskId" value={task._id?.toString()} />
          <input type="hidden" name="isExpired" value="false" />
          <input type="hidden" name="dueDate" value={renewTaskToToday()} />
          <button
            type="submit"
            className="text-indigo-800 bg-indigo-900/10 border border-indigo-800/50 p-2 px-4 justify-center text-md flex w-full rounded-sm items-center gap-2 font-barlow"
          >
            <RefreshCcw size={24} className="text-indigo-900" />
            Renew Task
          </button>
        </form>
        <form
          hidden={task.isExpired}
          className="flex flex-1"
          action={updateTask}
        >
          <input type="hidden" name="taskId" value={task._id?.toString()} />
          <input
            type="hidden"
            name="isCompleted"
            value={String(!task.isCompleted)}
          />
          <button
            className={`border ${task.isCompleted ? "text-green-800 border-green-800 bg-green-900/10" : "text-neutral-700 border-neutral-800"} p-2 justify-center text-md flex w-full rounded-sm items-center gap-2 font-barlow`}
            type="submit"
          >
            {task.isCompleted ? (
              <SquareCheck size={18} />
            ) : (
              <Square size={18} />
            )}
            {task.isCompleted ? "Completed" : "Complete"}
          </button>
        </form>
        <form className="flex" action={deleteTask}>
          <input type="hidden" name="taskId" value={task._id?.toString()} />
          <button
            type="submit"
            className="text-red-800 bg-red-900/10 border border-red-800/50 p-2 px-4 justify-center text-md flex w-full rounded-sm items-center gap-2 font-barlow"
          >
            <Trash2 size={14} />
          </button>
        </form>
      </div>
    </div>
  );
}
