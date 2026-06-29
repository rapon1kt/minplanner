import type { CalendarDay } from "./calendar-utils";

type CalendarDayCellProps = {
  day: CalendarDay;
  onSelectDateAction: (date: Date) => void;
};

function getTaskStatusSummary(tasks: CalendarDay["tasks"]) {
  return {
    completed: tasks.filter((task) => task.isCompleted).length,
    overdue: tasks.filter((task) => task.isExpired).length,
    pending: tasks.filter((task) => !task.isCompleted && !task.isExpired)
      .length,
  };
}

export default function CalendarDayCell({
  day,
  onSelectDateAction,
}: CalendarDayCellProps) {
  const statusSummary = getTaskStatusSummary(day.tasks);
  const hasTasks = day.tasks.length > 0;

  return (
    <button
      type="button"
      onClick={() => onSelectDateAction(day.date)}
      aria-label={`Select day ${day.dayNumber} with ${day.tasks.length} task${
        day.tasks.length === 1 ? "" : "s"
      }`}
      className={`group min-h-24 border-b border-r border-neutral-800 p-2 text-left transition-colors ${
        day.isSelected
          ? "bg-red-950/30"
          : hasTasks
            ? "bg-neutral-900/60 hover:bg-neutral-900"
            : "hover:bg-neutral-900/40"
      }`}
    >
      <div className="flex h-full flex-col justify-between">
        <div className="flex items-center justify-between gap-2">
          <span
            className={`font-barlow text-sm ${
              day.isSelected
                ? "text-red-200"
                : day.isToday
                  ? "text-red-400"
                  : "text-neutral-400"
            }`}
          >
            {day.dayNumber}
          </span>
          {hasTasks && (
            <span className="rounded-full border border-neutral-700 px-1.5 py-0.5 font-barlow text-[10px] text-neutral-400">
              {day.tasks.length}
            </span>
          )}
        </div>

        {hasTasks && (
          <div className="space-y-2">
            <p className="truncate font-barlow text-xs text-neutral-500 group-hover:text-neutral-400">
              {day.tasks[0].title}
            </p>
            <div className="flex items-center gap-1">
              {statusSummary.pending > 0 && (
                <span
                  aria-label={`${statusSummary.pending} pending task${
                    statusSummary.pending === 1 ? "" : "s"
                  }`}
                  className="size-1.5 rounded-full bg-neutral-500"
                />
              )}
              {statusSummary.completed > 0 && (
                <span
                  aria-label={`${statusSummary.completed} completed task${
                    statusSummary.completed === 1 ? "" : "s"
                  }`}
                  className="size-1.5 rounded-full bg-green-800"
                />
              )}
              {statusSummary.overdue > 0 && (
                <span
                  aria-label={`${statusSummary.overdue} overdue task${
                    statusSummary.overdue === 1 ? "" : "s"
                  }`}
                  className="size-1.5 rounded-full bg-red-800"
                />
              )}
            </div>
          </div>
        )}
      </div>
    </button>
  );
}
