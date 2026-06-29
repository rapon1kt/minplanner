"use client";
import type { Tag, Task } from "@/core/domain/models";
import {
  CalendarDays as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import CalendarDays from "./calendar-days";
import CalendarStats from "./calendar-stats";
import CalendarTaskPanel from "./calendar-task-panel";
import {
  getCalendarStats,
  getFullDateLabel,
  getMonthLabel,
  getTasksForDate,
  getTasksForMonth,
} from "./calendar-utils";

type CalendarContainerProps = {
  tags: Tag[];
  tasks: Task[];
};

export default function CalendarContainer({
  tags,
  tasks,
}: CalendarContainerProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const monthName = getMonthLabel(currentMonth);
  const selectedTasks = getTasksForDate(tasks, selectedDate);
  const monthlyTasks = getTasksForMonth(tasks, currentMonth);
  const stats = getCalendarStats(tasks, currentMonth);

  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1),
    );
    setSelectedDate(null);
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1),
    );
    setSelectedDate(null);
  };

  const goToToday = () => {
    const today = new Date();

    setCurrentMonth(today);
    setSelectedDate(today);
  };

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <div className="animate-fade-in space-y-6 p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-barlow text-xs uppercase tracking-[0.3em] text-red-900">
            Calendar
          </p>
          <h1 className="mt-2 font-space text-3xl text-neutral-200">
            {monthName}
          </h1>
          <p className="mt-2 max-w-xl font-barlow text-sm text-neutral-600">
            Follow due dates, overdue work, completed tasks and the unscheduled
            ideas that still need a date.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 font-barlow text-sm">
          <button
            type="button"
            className="flex cursor-pointer items-center gap-2 rounded-sm border border-neutral-800 bg-neutral-900/30 px-3 py-2 text-neutral-400 transition-colors hover:border-neutral-700 hover:text-neutral-200"
            onClick={goToPreviousMonth}
          >
            <ChevronLeft size={16} />
            Previous
          </button>
          <button
            type="button"
            className="flex cursor-pointer items-center gap-2 rounded-sm border border-red-800/60 bg-red-900/10 px-3 py-2 text-red-300 transition-colors hover:bg-red-900/20"
            onClick={goToToday}
          >
            <CalendarIcon size={16} />
            Today
          </button>
          <button
            type="button"
            className="flex cursor-pointer items-center gap-2 rounded-sm border border-neutral-800 bg-neutral-900/30 px-3 py-2 text-neutral-400 transition-colors hover:border-neutral-700 hover:text-neutral-200"
            onClick={goToNextMonth}
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <CalendarStats stats={stats} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(20rem,0.75fr)]">
        <CalendarDays
          currentMonth={currentMonth}
          onSelectDateAction={handleSelectDate}
          selectedDate={selectedDate}
          tasks={tasks}
        />

        <div className="space-y-4">
          <CalendarTaskPanel
            description={
              selectedDate
                ? "Tasks scheduled for the selected calendar day."
                : "Choose a day in the calendar to inspect its tasks."
            }
            emptyMessage={
              selectedDate
                ? "No tasks scheduled for this day."
                : "Select a day to see its tasks."
            }
            mode="cards"
            tags={tags}
            tasks={selectedTasks}
            title={
              selectedDate ? getFullDateLabel(selectedDate) : "Selected day"
            }
          />

          <CalendarTaskPanel
            description="Compact overview of every task scheduled this month."
            emptyMessage="No tasks scheduled for this month."
            tags={tags}
            tasks={monthlyTasks}
            title="Tasks for the Month"
          />
        </div>
      </div>
    </div>
  );
}
