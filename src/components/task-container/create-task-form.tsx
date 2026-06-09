"use client";
import { Plus } from "lucide-react";
import { useActionState } from "react";
import CreateTaskFormAlert from "./create-task-form-alert";
import createTaskAction from "@/actions/task/create-task-action";

import { initialTaskFormState } from "./create-task-form-types";
import type { Tag } from "@/core/domain/models";
import { getRecordId } from "@/utils";

export default function CreateTaskForm({
  isFormExpanded,
  tags,
}: {
  isFormExpanded: boolean;
  tags: Tag[];
}) {
  const [state, formAction, pending] = useActionState(
    createTaskAction,
    initialTaskFormState,
  );

  return (
    <div className="space-y-6">
      <CreateTaskFormAlert result={state} />
      <form
        hidden={!isFormExpanded}
        action={formAction}
        className="flex flex-col mb-6 animate-fade-in md:flex-row md:items-end gap-2"
      >
        <div className="flex flex-col gap-1 flex-1">
          <label
            className="text-neutral-400 font-space text-xs "
            htmlFor="title"
          >
            Title
          </label>
          <input
            name="title"
            type="text"
            placeholder="Add new task ..."
            className="font-barlow py-2 bg-neutral-900 border border-neutral-800 rounded-sm px-2 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:bg-neutral-800 focus:border-red-900 transition-all"
          />
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <label
            className="text-neutral-400 font-space text-xs "
            htmlFor="description"
          >
            Description
          </label>
          <input
            type="text"
            name="description"
            placeholder="Type a short description about..."
            contentEditable={true}
            className="font-barlow py-2 flex-1 bg-neutral-900 border border-neutral-800 rounded-sm px-2 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:bg-neutral-800 focus:border-red-900 transition-all"
          />
        </div>

        <div className="flex flex-col gap-1 flex-1">
          <label
            className="text-neutral-400 font-space text-xs "
            htmlFor="dueDate"
          >
            Due Date
          </label>
          <input
            name="dueDate"
            type="date"
            className="font-barlow py-2 bg-neutral-900 border border-neutral-800 rounded-sm px-2 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:bg-neutral-800 focus:border-red-900 transition-all"
          />
        </div>

        <div className="flex flex-col gap-1 flex-1">
          <label
            className="text-neutral-400 font-space text-xs "
            htmlFor="severity"
          >
            Priority
          </label>
          <select
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
        <div className="flex flex-col gap-1 flex-1 md:max-w-56">
          <label className="text-neutral-400 font-space text-xs">Tags</label>
          <div className="flex h-10 overflow-auto gap-2 rounded-sm border border-neutral-800 bg-neutral-900 px-2 py-2">
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

        <button
          disabled={pending}
          type="submit"
          aria-label="Create task"
          className="cursor-pointer py-3 mt-2 md:mt-0 justify-center font-barlow bg-red-900/70 text-white rounded-sm px-3 hover:bg-red-800/50 transition-colors flex items-center gap-2 font-normal tracking-wide"
        >
          <Plus size={18} />
        </button>
      </form>
    </div>
  );
}
