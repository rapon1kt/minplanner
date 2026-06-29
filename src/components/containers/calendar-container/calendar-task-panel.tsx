import type { Tag, Task } from "@/core/domain/models";
import CalendarTaskItem from "./calendar-task-item";

type CalendarTaskPanelProps = {
  description: string;
  emptyMessage: string;
  mode?: "cards" | "compact";
  tags: Tag[];
  tasks: Task[];
  title: string;
};

export default function CalendarTaskPanel({
  description,
  emptyMessage,
  mode = "compact",
  tags,
  tasks,
  title,
}: CalendarTaskPanelProps) {
  return (
    <section className="rounded-sm border border-neutral-800 bg-neutral-950 p-4">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          <h2 className="font-space text-lg text-neutral-300">{title}</h2>
          <p className="mt-1 font-barlow text-sm text-neutral-600">
            {description}
          </p>
        </div>
        <span className="rounded-sm border bg-neutral-900 border-neutral-800 p-1 font-barlow text-xs text-neutral-500">
          {tasks.length} tasks
        </span>
      </div>

      {tasks.length === 0 ? (
        <p className="rounded-sm border border-dashed border-neutral-800 p-4 text-center font-barlow text-sm   text-neutral-600">
          {emptyMessage}
        </p>
      ) : (
        <div className="space-y-2">
          {tasks.map((task) =>
            mode === "cards" ? (
              <div
                key={`${task._id?.toString()}-card`}
                className="flex gap-2 items-center"
              >
                <div
                  className={`w-2 h-2 rounded-full ${task.isCompleted && "bg-green-900"} ${task.isExpired && "bg-red-900"} ${!task.isCompleted && !task.isExpired && "bg-amber-700"}`}
                />
                <p className="text-neutral-300 text-md font-barlow">
                  {task.title}
                </p>
              </div>
            ) : (
              <CalendarTaskItem
                key={task._id?.toString()}
                tags={tags}
                task={task}
              />
            ),
          )}
        </div>
      )}
    </section>
  );
}
