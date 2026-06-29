import type { Task } from "@/core/domain/models";
import CalendarDayCell from "./calendar-day-cell";
import { getCalendarDays, WEEKDAY_LABELS } from "./calendar-utils";

type CalendarDaysProps = {
  currentMonth: Date;
  onSelectDateAction: (date: Date) => void;
  selectedDate: Date | null;
  tasks: Task[];
};

export default function CalendarDays({
  currentMonth,
  onSelectDateAction,
  selectedDate,
  tasks,
}: CalendarDaysProps) {
  const calendarDays = getCalendarDays(currentMonth, tasks, selectedDate);

  return (
    <div className="overflow-hidden rounded-sm border border-neutral-800">
      <div className="grid grid-cols-7 border-b border-neutral-800 bg-neutral-900">
        {WEEKDAY_LABELS.map((day) => (
          <div
            className="p-3 text-center font-barlow text-xs font-normal tracking-wide text-neutral-500 sm:p-4"
            key={day}
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {calendarDays.map((day, idx) =>
          day ? (
            <CalendarDayCell
              day={day}
              key={day.key}
              onSelectDateAction={onSelectDateAction}
            />
          ) : (
            <div
              aria-hidden="true"
              className="min-h-24 border-b border-r border-neutral-800 bg-neutral-950/60"
              key={`empty-${idx}`}
            />
          ),
        )}
      </div>
    </div>
  );
}
