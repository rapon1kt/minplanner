"use client";
import { useActionState, useId } from "react";
import { Save, X } from "lucide-react";
import updateTaskAction from "@/actions/task/update-task-action";
import type { Tag, Task } from "@/core/domain/models";
import { getRecordId, getValueId } from "@/utils";
import CreateTaskFormAlert from "./create-task-form-alert";
import { initialTaskFormState } from "./create-task-form-types";

type EditTaskModalProps = {
  onCloseAction: () => void;
  tags: Tag[];
  task: Task;
};

function getDateInputValue(dueDate?: string) {
  if (!dueDate) return "";

  const date = new Date(dueDate);
  if (Number.isNaN(date.getTime())) return "";

  const localDate = new Date(
    date.getTime() - date.getTimezoneOffset() * 60_000,
  );

  return localDate.toISOString().slice(0, 10);
}

export default function EditTaskModal({
  onCloseAction,
  tags,
  task,
}: EditTaskModalProps) {
  const [state, formAction, pending] = useActionState(
    updateTaskAction,
    initialTaskFormState,
  );
  const titleId = useId();
  const taskId = getRecordId(task);
  const taskTagIds = new Set(task.tags?.map(getValueId) ?? []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCloseAction();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="max-h-[calc(100vh-3rem)] w-full max-w-2xl overflow-y-auto rounded-sm border border-neutral-800 bg-neutral-950 p-5 shadow-2xl shadow-black/40"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 id={titleId} className="font-space text-lg text-neutral-200">
              Edit task
            </h2>
            <p className="mt-1 max-w-full wrap-anywhere font-barlow text-sm text-neutral-500">
              Adjust the details for{" "}
              <span className="text-neutral-300">{task.title}</span>.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close edit task modal"
            onClick={onCloseAction}
            className="cursor-pointer text-neutral-600 transition-colors hover:text-neutral-300"
          >
            <X size={18} />
          </button>
        </div>

        <CreateTaskFormAlert result={state} />

        <form action={formAction} className="mt-4 space-y-4">
          <input type="hidden" name="taskId" value={taskId} />
          <input type="hidden" name="shouldUpdateTags" value="true" />

          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label
                className="text-neutral-400 font-space text-xs"
                htmlFor={`edit-title-${taskId}`}
              >
                Title
              </label>
              <input
                id={`edit-title-${taskId}`}
                name="title"
                type="text"
                defaultValue={task.title}
                maxLength={50}
                className="font-barlow py-2 bg-neutral-900 border border-neutral-800 rounded-sm px-2 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:bg-neutral-800 focus:border-red-900 transition-all"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <label
                  className="text-neutral-400 font-space text-xs"
                  htmlFor={`edit-due-date-${taskId}`}
                >
                  Due Date
                </label>
                <input
                  id={`edit-due-date-${taskId}`}
                  name="dueDate"
                  type="date"
                  defaultValue={getDateInputValue(task.dueDate)}
                  className="font-barlow py-2 bg-neutral-900 border border-neutral-800 rounded-sm px-2 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:bg-neutral-800 focus:border-red-900 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label
                  className="text-neutral-400 font-space text-xs"
                  htmlFor={`edit-severity-${taskId}`}
                >
                  Priority
                </label>
                <select
                  id={`edit-severity-${taskId}`}
                  name="severity"
                  defaultValue={task.severity ?? ""}
                  className="cursor-pointer font-barlow py-2.5 bg-neutral-900 border border-neutral-800 rounded-sm px-2 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:bg-neutral-800 focus:border-red-900 transition-all"
                >
                  <option value="">None</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label
              className="text-neutral-400 font-space text-xs"
              htmlFor={`edit-description-${taskId}`}
            >
              Description
            </label>
            <textarea
              id={`edit-description-${taskId}`}
              name="description"
              defaultValue={task.description}
              maxLength={300}
              rows={3}
              className="font-barlow resize-none py-2 bg-neutral-900 border border-neutral-800 rounded-sm px-2 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:bg-neutral-800 focus:border-red-900 transition-all"
            />
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-neutral-400 font-space text-xs">Tags</span>
            <div className="flex min-h-10 flex-wrap gap-2 rounded-sm border border-neutral-800 bg-neutral-900 px-2 py-2">
              {tags.length === 0 ? (
                <span className="font-barlow text-sm text-neutral-600">
                  No tags yet
                </span>
              ) : (
                tags.map((tag) => {
                  const tagId = getRecordId(tag);

                  return (
                    <label
                      key={tagId}
                      className="flex cursor-pointer items-center gap-1 rounded-full border border-neutral-800 px-2 py-1 font-barlow text-xs text-neutral-400 transition-colors hover:bg-neutral-800"
                    >
                      <input
                        type="checkbox"
                        name="tags"
                        value={tagId}
                        defaultChecked={taskTagIds.has(tagId)}
                        className="sr-only peer"
                      />
                      <span
                        className="size-2 rounded-full"
                        style={{ backgroundColor: tag.color }}
                      />
                      <span className="peer-checked:text-neutral-100">
                        {tag.title}
                      </span>
                    </label>
                  );
                })
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onCloseAction}
              className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-sm border border-neutral-800 bg-neutral-900 px-4 py-2 font-barlow text-sm text-neutral-400 transition-colors hover:border-neutral-700 hover:text-neutral-200 sm:flex-none"
            >
              <X size={14} />
              Cancel
            </button>
            <button
              disabled={pending}
              type="submit"
              className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-sm border border-red-800/70 bg-red-900/10 px-4 py-2 font-barlow text-sm text-red-300 transition-colors hover:bg-red-900/20 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
            >
              <Save size={14} />
              Save task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
