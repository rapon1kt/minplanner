"use client";
import TaskTopBar from "./task-top-bar";
import { Tag, Task } from "@/core/domain/models";
import TaskCard from "./task-card/task-card";
import { TriangleAlert } from "lucide-react";
import { useState } from "react";
import { getValueId } from "@/utils";
import {
  ALL_TAGS_FILTER,
  UNTAGGED_TAGS_FILTER,
} from "./task-filter-constants";

const dateFilter = (dueDateString: string | undefined): boolean => {
  const today = new Date();
  if (dueDateString) {
    const dueDate = new Date(dueDateString);
    return dueDate.toDateString() == today.toDateString();
  }
  return false;
};

const getDailyTasks = (tasks: Task[]): Task[] => {
  return tasks.filter((task) => dateFilter(task.dueDate) && !task.isExpired);
};

function filterTasksByTag(tasks: Task[], selectedTagId: string) {
  if (selectedTagId === ALL_TAGS_FILTER) return tasks;

  return tasks.filter((task) => {
    const taskTagIds = task.tags?.map(getValueId) ?? [];

    if (selectedTagId === UNTAGGED_TAGS_FILTER) {
      return taskTagIds.length === 0;
    }

    return taskTagIds.includes(selectedTagId);
  });
}

export default function TaskContainer({
  tags,
  tasks,
}: {
  tags: Tag[];
  tasks: Task[];
}) {
  const [selectedTagId, setSelectedTagId] = useState(ALL_TAGS_FILTER);
  const filteredTasks = filterTasksByTag(tasks, selectedTagId);
  const dailyTasks = getDailyTasks(filteredTasks);
  const otherTasks = filteredTasks.filter(
    (task) => !dateFilter(task.dueDate) && !task.isExpired,
  );
  const expiredTasks = filteredTasks.filter((task) => task.isExpired);
  const isFiltering = selectedTagId !== ALL_TAGS_FILTER;

  return (
    <div className="animate-fade-in p-8">
      <TaskTopBar
        onSelectTagIdAction={setSelectedTagId}
        selectedTagId={selectedTagId}
        tags={tags}
      />
      <div className="space-y-2">
        {tasks.length === 0 ? (
          <p className="text-neutral-500 text-center">
            No tasks yet. Create a new one!
          </p>
        ) : filteredTasks.length === 0 ? (
          <p className="text-neutral-500 text-center">
            No tasks match this tag filter.
          </p>
        ) : (
          <div className="space-y-4">
            {isFiltering && (
              <p className="font-barlow text-sm text-neutral-500">
                Showing {filteredTasks.length} of {tasks.length} tasks.
              </p>
            )}
            {expiredTasks.length != 0 && (
              <>
                <p className="text-lg flex gap-2 items-center font-space text-red-500/70">
                  <TriangleAlert size={18} />
                  Overdue
                </p>
                {expiredTasks.map((task) => (
                  <TaskCard
                    tags={tags}
                    task={task}
                    key={task._id?.toString()}
                  />
                ))}
              </>
            )}
            {dailyTasks.length != 0 && (
              <>
                <p className="text-lg font-space text-neutral-400">Daily</p>
                {dailyTasks.map((task) => (
                  <TaskCard
                    tags={tags}
                    task={task}
                    key={task._id?.toString()}
                  />
                ))}
              </>
            )}
            {dailyTasks.length == 0 && expiredTasks.length == 0 ? (
              <p className="text-lg font-space text-neutral-400">Tasks</p>
            ) : (
              <p
                hidden={otherTasks.length == 0}
                className="text-lg font-space text-neutral-400"
              >
                Others
              </p>
            )}
            {tasks.length == 0 && otherTasks.length == 0 ? (
              <p className="text-sm text-center font-barlow text-neutral-400">
                No other tasks present yet! Try creating new ones...
              </p>
            ) : (
              otherTasks.map((task) => (
                <TaskCard tags={tags} task={task} key={task._id?.toString()} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
