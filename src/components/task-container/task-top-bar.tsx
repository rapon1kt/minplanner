"use client";
import { Check, Filter, Plus } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import CreateTaskForm from "./create-task-form";
import FilterTasks from "./filter-tasks";
import type { Tag } from "@/core/domain/models";
import { commonFilters } from "@/utils/filters";

interface TaskTopChildrenProps {
  isFilterExpanded: boolean;
  onSelectTagIdAction: Dispatch<SetStateAction<string>>;
  selectedTagId: string;
  tags: Tag[];
}

function TaskTopChildrenExpanded({
  isFilterExpanded,
  onSelectTagIdAction,
  selectedTagId,
  tags,
}: TaskTopChildrenProps) {
  if (isFilterExpanded) {
    return (
      <FilterTasks
        isFilterExpanded={isFilterExpanded}
        onSelectTagIdAction={onSelectTagIdAction}
        selectedTagId={selectedTagId}
        tags={tags}
      />
    );
  }
}

function preventDuplicatedExpanded(
  prev: boolean,
  setOther: Dispatch<SetStateAction<boolean>>,
) {
  setOther(false);
  return !prev;
}

export default function TaskTopBar({
  onSelectTagIdAction,
  selectedTagId,
  tags,
}: {
  onSelectTagIdAction: Dispatch<SetStateAction<string>>;
  selectedTagId: string;
  tags: Tag[];
}) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isFilterExpanded, setIsFilterExpanded] = useState<boolean>(false);

  return (
    <>
      <div className="mb-6">
        <p className="flex items-center gap-2 font-barlow text-sm uppercase tracking-widest text-red-900">
          <Check size={16} />
          Tags
        </p>
        <h1 className="mt-1 font-space text-3xl text-neutral-300">
          List your tasks here!
        </h1>
        <p></p>
      </div>
      <div
        className={`flex flex-col sm:flex-row w-full p-3 ${isFilterExpanded ? "mb-3" : "mb-6"} rounded-sm border border-neutral-800 bg-neutral-900/20 gap-2 justify-between`}
      >
        <button
          onClick={() => {
            setIsFilterExpanded(false);
            setIsCreateModalOpen((prev) => !prev);
          }}
          className="hover:bg-red-900/40 border border-red-800/20 w-full sm:w-auto justify-center sm:justify-start cursor-pointer flex items-center gap-2 p-2  bg-red-900/10 rounded-sm transition-colors"
        >
          <Plus className="text-red-50" size={18} />
        </button>
        <div className="grid grid-cols-2 gap-1 sm:flex sm:flex-row sm:gap-3">
          {commonFilters.map((commonFilter) => (
            <button
              className={`${commonFilter.filter === selectedTagId && "bg-red-900/10"} text-neutral-400 text-sm sm:text-xs border border-red-900/30 font-barlow p-1 sm:p-0 rounded-sm flex-1 sm:w-20 cursor-pointer`}
              onClick={() => onSelectTagIdAction(commonFilter.filter)}
              key={commonFilter.id}
            >
              {commonFilter.text}
            </button>
          ))}
        </div>
        <button
          onClick={() =>
            setIsFilterExpanded((prev) =>
              preventDuplicatedExpanded(prev, setIsCreateModalOpen),
            )
          }
          className="bg-neutral-800 flex justify-center p-2 sm:bg-transparent cursor-pointer px-4 rounded-sm"
        >
          <Filter className="text-neutral-500" size={18} />
        </button>
      </div>
      {isCreateModalOpen && (
        <CreateTaskForm
          tags={tags}
          onCloseAction={() => setIsCreateModalOpen(false)}
        />
      )}
      <TaskTopChildrenExpanded
        isFilterExpanded={isFilterExpanded}
        onSelectTagIdAction={onSelectTagIdAction}
        selectedTagId={selectedTagId}
        tags={tags}
      />
    </>
  );
}
