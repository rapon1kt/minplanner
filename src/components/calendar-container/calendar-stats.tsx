import type { CalendarStats as CalendarStatsType } from "./calendar-utils";

type CalendarStatsProps = {
  stats: CalendarStatsType;
};

const statCards = [
  { key: "scheduled", label: "Scheduled", tone: "text-neutral-300" },
  { key: "pending", label: "Pending", tone: "text-amber-700" },
  { key: "completed", label: "Completed", tone: "text-green-800" },
  { key: "overdue", label: "Overdue", tone: "text-red-800" },
  { key: "unscheduled", label: "No due date", tone: "text-neutral-500" },
] as const;

export default function CalendarStats({ stats }: CalendarStatsProps) {
  return (
    <div className="grid gap-2 grid-cols-2 sm:grid-cols-5">
      {statCards.map((stat) => (
        <div
          className="rounded-sm border border-neutral-800 bg-neutral-900/20 p-4"
          key={stat.key}
        >
          <p className="font-barlow text-xs uppercase tracking-widest text-neutral-600">
            {stat.label}
          </p>
          <p className={`mt-2 font-space text-2xl ${stat.tone}`}>
            {stats[stat.key]}
          </p>
        </div>
      ))}
    </div>
  );
}
