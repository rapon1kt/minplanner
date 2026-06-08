"use client";
import type { Dispatch, SetStateAction } from "react";
import type { Tag } from "@/core/domain/models";
import { getRecordId } from "@/utils";
import {
  ALL_TAGS_FILTER,
  UNTAGGED_TAGS_FILTER,
} from "./task-filter-constants";

export default function FilterTasks({
  isFilterExpanded,
  onSelectTagIdAction,
  selectedTagId,
  tags,
}: {
  isFilterExpanded: boolean;
  onSelectTagIdAction: Dispatch<SetStateAction<string>>;
  selectedTagId: string;
  tags: Tag[];
}) {
  return (
    <form
      className="animate-fade-in mb-6 rounded-sm border border-neutral-800 bg-neutral-900/20 p-4"
      hidden={!isFilterExpanded}
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
        <div className="flex flex-col gap-1">
          <label
            className="text-neutral-400 font-space text-xs"
            htmlFor="tag-filter"
          >
            Filter by tag
          </label>
          <select
            id="tag-filter"
            value={selectedTagId}
            onChange={(event) => onSelectTagIdAction(event.target.value)}
            className="cursor-pointer font-barlow py-2.5 bg-neutral-900 border border-neutral-800 rounded-sm px-2 text-sm text-neutral-100 focus:outline-none focus:bg-neutral-800 focus:border-red-900 transition-all"
          >
            <option value={ALL_TAGS_FILTER}>All tasks</option>
            <option value={UNTAGGED_TAGS_FILTER}>Tasks without tags</option>
            {tags.map((tag) => (
              <option key={getRecordId(tag)} value={getRecordId(tag)}>
                {tag.title}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={() => onSelectTagIdAction(ALL_TAGS_FILTER)}
          className="cursor-pointer rounded-sm border border-neutral-800 px-4 py-2.5 font-barlow text-sm text-neutral-400 transition-colors hover:bg-neutral-900"
        >
          Clear filter
        </button>
      </div>
      {tags.length === 0 && (
        <p className="mt-3 font-barlow text-sm text-neutral-500">
          Create tags first to unlock focused task filtering.
        </p>
      )}
    </form>
  );
}
