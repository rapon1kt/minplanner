"use client";
import { ArrowDown, Filter, Plus } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import CreateTaskForm from "./create-task-form";
import FilterTasks from "./filter-tasks";
import type { Tag } from "@/core/domain/models";

interface TaskTopChildrenProps {
  isFormExpanded: boolean;
  isFilterExpanded: boolean;
  onSelectTagIdAction: Dispatch<SetStateAction<string>>;
  selectedTagId: string;
  tags: Tag[];
}

function TaskTopChildrenExpanded({
  isFormExpanded,
  isFilterExpanded,
  onSelectTagIdAction,
  selectedTagId,
  tags,
}: TaskTopChildrenProps) {
  if (isFormExpanded) {
    return <CreateTaskForm isFormExpanded tags={tags} />;
  }
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
  const [isFormExpanded, setIsFormExpanded] = useState<boolean>(false);
  const [isFilterExpanded, setIsFilterExpanded] = useState<boolean>(false);

  return (
    <>
      <div
        className={`flex w-full ${isFormExpanded || isFilterExpanded ? "pb-3 mb-3" : "mb-6 pb-0"} gap-2 justify-between`}
      >
        <button
          onClick={() => {
            setIsFormExpanded((prev) =>
              preventDuplicatedExpanded(prev, setIsFilterExpanded),
            );
          }}
          className="hover:bg-red-800/50 w-full sm:w-auto justify-center sm:justify-start cursor-pointer flex items-center gap-2 py-1.5 px-4  bg-red-900/70 rounded-sm"
        >
          {isFormExpanded && <ArrowDown className="text-red-50" size={18} />}
          {!isFormExpanded && <Plus className="text-red-50" size={18} />}
          <span className="text-red-50 font-barlow">Create Task</span>
        </button>
        <button
          onClick={() =>
            setIsFilterExpanded((prev) =>
              preventDuplicatedExpanded(prev, setIsFormExpanded),
            )
          }
          className="bg-neutral-800 sm:bg-transparent cursor-pointer px-4 rounded-sm"
        >
          <Filter className="text-neutral-500" size={18} />
        </button>
      </div>
      <TaskTopChildrenExpanded
        isFilterExpanded={isFilterExpanded}
        isFormExpanded={isFormExpanded}
        onSelectTagIdAction={onSelectTagIdAction}
        selectedTagId={selectedTagId}
        tags={tags}
      />
    </>
  );
}
