"use client";
import type { Task } from "@/core/domain/models";
import { renewTaskToToday } from "./task-card-utils";
import { updateTask } from "@/actions/task/form-actions";
import { Pencil, RefreshCcw, Square, SquareCheck, Trash2 } from "lucide-react";

type TaskActionProps = {
  task: Task;
};

type DeleteActionProps = {
  onDeleteIntentAction: () => void;
};

type EditActionProps = {
  onEditIntentAction: () => void;
};

export function TaskDesktopStatusAction({ task }: TaskActionProps) {
  const taskId = task._id?.toString();

  return (
    <div className="hidden flex-col h-full sm:flex items-start sm:items-center gap-2">
      {task.isExpired ? (
        <form className="flex" action={updateTask}>
          <input type="hidden" name="taskId" value={taskId} />
          <input type="hidden" name="isExpired" value="false" />
          <input type="hidden" name="dueDate" value={renewTaskToToday()} />
          <button
            type="submit"
            aria-label="Renew task"
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
          <input type="hidden" name="taskId" value={taskId} />
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
  );
}

export function TaskDesktopDeleteButton({
  onDeleteIntentAction,
}: DeleteActionProps) {
  return (
    <button
      type="button"
      aria-label="Delete task"
      onClick={onDeleteIntentAction}
      className="hidden sm:flex cursor-pointer shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-neutral-600 hover:text-red-900"
    >
      <Trash2 size={18} />
    </button>
  );
}

export function TaskDesktopEditButton({ onEditIntentAction }: EditActionProps) {
  return (
    <button
      type="button"
      aria-label="Edit task"
      onClick={onEditIntentAction}
      className="hidden sm:flex cursor-pointer shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-neutral-600 hover:text-neutral-300"
    >
      <Pencil size={18} />
    </button>
  );
}

export function TaskMobileActions({
  onDeleteIntentAction,
  onEditIntentAction,
  task,
}: TaskActionProps & DeleteActionProps & EditActionProps) {
  const taskId = task._id?.toString();

  return (
    <div className="flex gap-2 w-full sm:hidden">
      <form
        hidden={!task.isExpired}
        className="flex flex-1"
        action={updateTask}
      >
        <input type="hidden" name="taskId" value={taskId} />
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
      <form hidden={task.isExpired} className="flex flex-1" action={updateTask}>
        <input type="hidden" name="taskId" value={taskId} />
        <input
          type="hidden"
          name="isCompleted"
          value={String(!task.isCompleted)}
        />
        <button
          className={`border ${task.isCompleted ? "text-green-800 border-green-800 bg-green-900/10" : "text-neutral-700 border-neutral-800"} p-2 justify-center text-md flex w-full rounded-sm items-center gap-2 font-barlow`}
          type="submit"
        >
          {task.isCompleted ? <SquareCheck size={18} /> : <Square size={18} />}
          {task.isCompleted ? "Completed" : "Complete"}
        </button>
      </form>
      <div className="flex">
        <button
          type="button"
          aria-label="Edit task"
          onClick={onEditIntentAction}
          className="text-neutral-400 bg-neutral-900/60 border border-neutral-800 p-2 px-4 justify-center text-md flex w-full rounded-sm items-center gap-2 font-barlow"
        >
          <Pencil size={14} />
        </button>
      </div>
      <div className="flex">
        <button
          type="button"
          aria-label="Delete task"
          onClick={onDeleteIntentAction}
          className="text-red-800 bg-red-900/10 border border-red-800/50 p-2 px-4 justify-center text-md flex w-full rounded-sm items-center gap-2 font-barlow"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
