"use client";
import { Plus, X } from "lucide-react";
import { useActionState, useId } from "react";
import CreateTaskFormAlert from "./create-task-form-alert";
import createTaskAction from "@/actions/task/create-task-action";

import { initialTaskFormState } from "./create-task-form-types";
import type { Tag } from "@/core/domain/models";
import { getRecordId } from "@/utils";

type CreateTaskFormProps = {
  onCloseAction: () => void;
  tags: Tag[];
};

export default function CreateTaskForm({
  onCloseAction,
  tags,
}: CreateTaskFormProps) {
  const [state, formAction, pending] = useActionState(
    createTaskAction,
    initialTaskFormState,
  );
  const titleId = useId();

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
              Create task
            </h2>
            <p className="mt-1 max-w-full wrap-anywhere font-barlow text-sm text-neutral-500">
              Fill in the details for your next task.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close create task modal"
            onClick={onCloseAction}
            className="cursor-pointer text-neutral-600 transition-colors hover:text-neutral-300"
          >
            <X size={18} />
          </button>
        </div>

        <CreateTaskFormAlert result={state} />

        <form action={formAction} className="mt-4 space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label
                className="text-neutral-400 font-space text-xs"
                htmlFor="create-title"
              >
                Title
              </label>
              <input
                id="create-title"
                name="title"
                type="text"
                placeholder="Add new task ..."
                maxLength={50}
                className="font-barlow py-2 bg-neutral-900 border border-neutral-800 rounded-sm px-2 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:bg-neutral-800 focus:border-red-900 transition-all"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <label
                  className="text-neutral-400 font-space text-xs"
                  htmlFor="create-due-date"
                >
                  Due Date
                </label>
                <input
                  id="create-due-date"
                  name="dueDate"
                  type="date"
                  className="font-barlow py-2 bg-neutral-900 border border-neutral-800 rounded-sm px-2 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:bg-neutral-800 focus:border-red-900 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label
                  className="text-neutral-400 font-space text-xs"
                  htmlFor="create-severity"
                >
                  Priority
                </label>
                <select
                  id="create-severity"
                  name="severity"
                  defaultValue=""
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
              htmlFor="create-description"
            >
              Description
            </label>
            <textarea
              id="create-description"
              name="description"
              placeholder="Type a short description about..."
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
              <Plus size={14} />
              Create task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
