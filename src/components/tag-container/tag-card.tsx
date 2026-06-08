"use client";
import { useActionState, useState } from "react";
import { Pencil, Save, Trash2, X } from "lucide-react";
import deleteTagAction from "@/actions/tag/delete-tag-action";
import updateTagAction from "@/actions/tag/update-tag-action";
import type { Tag } from "@/core/domain/models";
import { getRecordId } from "@/utils";
import TagFormAlert from "./tag-form-alert";
import { initialTagFormState } from "./tag-form-types";

export default function TagCard({ tag }: { tag: Tag }) {
  const [isEditing, setIsEditing] = useState(false);
  const [updateState, updateFormAction, updatePending] = useActionState(
    updateTagAction,
    initialTagFormState,
  );
  const [deleteState, deleteFormAction, deletePending] = useActionState(
    deleteTagAction,
    initialTagFormState,
  );
  const tagId = getRecordId(tag);

  if (isEditing) {
    return (
      <div className="animate-fade-in rounded-sm border border-neutral-800 bg-neutral-900/20 p-4">
        <TagFormAlert result={updateState} />
        <form action={updateFormAction} className="mt-3 space-y-3">
          <input type="hidden" name="tagId" value={tagId} />

          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <div className="flex flex-col gap-1">
              <label
                className="text-neutral-400 font-space text-xs"
                htmlFor={`title-${tagId}`}
              >
                Title
              </label>
              <input
                id={`title-${tagId}`}
                name="title"
                type="text"
                defaultValue={tag.title}
                maxLength={20}
                className="font-barlow py-2 bg-neutral-900 border border-neutral-800 rounded-sm px-2 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:bg-neutral-800 focus:border-red-900 transition-all"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                className="text-neutral-400 font-space text-xs"
                htmlFor={`color-${tagId}`}
              >
                Color
              </label>
              <input
                id={`color-${tagId}`}
                name="color"
                type="color"
                defaultValue={tag.color}
                className="h-10 w-full cursor-pointer rounded-sm border border-neutral-800 bg-neutral-900 sm:w-14"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label
              className="text-neutral-400 font-space text-xs"
              htmlFor={`description-${tagId}`}
            >
              Description
            </label>
            <input
              id={`description-${tagId}`}
              name="description"
              type="text"
              defaultValue={tag.description}
              maxLength={100}
              className="font-barlow py-2 bg-neutral-900 border border-neutral-800 rounded-sm px-2 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:bg-neutral-800 focus:border-red-900 transition-all"
            />
          </div>

          <div className="flex gap-2">
            <button
              disabled={updatePending}
              type="submit"
              className="flex cursor-pointer items-center gap-2 rounded-sm bg-red-900/70 px-3 py-2 font-barlow text-sm text-white transition-colors hover:bg-red-800/50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={16} />
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="flex cursor-pointer items-center gap-2 rounded-sm border border-neutral-800 px-3 py-2 font-barlow text-sm text-neutral-400 transition-colors hover:bg-neutral-900"
            >
              <X size={16} />
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <article className="group rounded-sm border border-neutral-800 bg-neutral-900/20 p-4 transition-all hover:border-neutral-700 hover:bg-neutral-900/40">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex min-w-0 items-center gap-2">
              <span
                className="size-3 shrink-0 rounded-full"
                style={{ backgroundColor: tag.color }}
              />
              <h3 className="min-w-0 wrap-anywhere font-space text-lg text-neutral-300">
                {tag.title}
              </h3>
            </div>
            <p className="mt-1 max-w-full wrap-anywhere font-barlow text-sm text-neutral-500">
              {tag.description || "No description yet."}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2 opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100">
            <button
              type="button"
              aria-label={`Edit ${tag.title}`}
              onClick={() => setIsEditing(true)}
              className="cursor-pointer text-neutral-500 transition-colors hover:text-neutral-300"
            >
              <Pencil size={16} />
            </button>
            <form
              action={deleteFormAction}
              onSubmit={(event) => {
                if (
                  !window.confirm(
                    "Delete this tag? It will also be removed from existing tasks.",
                  )
                ) {
                  event.preventDefault();
                }
              }}
            >
              <input type="hidden" name="tagId" value={tagId} />
              <button
                disabled={deletePending}
                type="submit"
                aria-label={`Delete ${tag.title}`}
                className="cursor-pointer text-neutral-600 transition-colors hover:text-red-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Trash2 size={16} />
              </button>
            </form>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-neutral-900 pt-3">
          <span className="rounded-full border border-neutral-800 px-2 py-0.5 font-barlow text-xs text-neutral-500">
            {tag.color.toUpperCase()}
          </span>
          <span className="font-barlow text-xs text-neutral-600">
            Tag id: {tagId.slice(-6)}
          </span>
        </div>

        <TagFormAlert result={deleteState} />
      </div>
    </article>
  );
}
