"use client";
import { useState } from "react";
import TaskTopBar from "./task-top-bar";
import TaskCard from "./task-card/task-card";
import { TriangleAlert } from "lucide-react";
import { Tag, Task } from "@/core/domain/models";
import {
  ALL_TAGS_FILTER,
  TODAY_TAGS_FILTER,
  filterTasksByTag,
  getDailyTasks,
  isToday,
} from "@/utils/filters";

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
    (task) => !isToday(task.dueDate) && !task.isExpired,
  );
  const expiredTasks = filteredTasks.filter((task) => task.isExpired);
  const isFiltering = selectedTagId !== ALL_TAGS_FILTER;

  const renderTaskContent = () => {
    if (tasks.length === 0) {
      return (
        <p className="border border-dashed border-neutral-800 rounded-sm py-4 text-neutral-500 text-center">
          No tasks yet. Create a new one!
        </p>
      );
    }

    if (filteredTasks.length === 0) {
      return (
        <p className="text-neutral-500 text-center">
          No tasks match this filter.
        </p>
      );
    }

    return (
      <div className="space-y-4">
        {isFiltering && (
          <p className="font-barlow text-sm text-neutral-500">
            Showing {filteredTasks.length} of {tasks.length} tasks.
          </p>
        )}

        {expiredTasks.length > 0 && (
          <>
            <p className="text-lg flex gap-2 items-center font-space text-red-500/70">
              <TriangleAlert size={18} />
              Overdue
            </p>
            {expiredTasks.map((task) => (
              <TaskCard tags={tags} task={task} key={task._id?.toString()} />
            ))}
          </>
        )}

        {dailyTasks.length > 0 && (
          <>
            {selectedTagId !== TODAY_TAGS_FILTER && (
              <p className="text-lg font-space text-neutral-400">Daily</p>
            )}
            {dailyTasks.map((task) => (
              <TaskCard tags={tags} task={task} key={task._id?.toString()} />
            ))}
          </>
        )}

        {dailyTasks.length === 0 && expiredTasks.length === 0 ? (
          <p className="text-lg font-space text-neutral-400">Tasks</p>
        ) : (
          otherTasks.length > 0 && (
            <p className="text-lg font-space text-neutral-400">Others</p>
          )
        )}

        {otherTasks.length > 0 &&
          otherTasks.map((task) => (
            <TaskCard tags={tags} task={task} key={task._id?.toString()} />
          ))}
      </div>
    );
  };

  return (
    <div className="animate-fade-in p-8">
      <TaskTopBar
        onSelectTagIdAction={setSelectedTagId}
        selectedTagId={selectedTagId}
        tags={tags}
      />
      <div className="space-y-2 mt-4">{renderTaskContent()}</div>
    </div>
  );
}
