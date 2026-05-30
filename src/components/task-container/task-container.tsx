import { Task } from "@/core/domain/models";
import TaskCard from "./task-card/task-card";
import { TriangleAlert } from "lucide-react";
import CreateTaskForm from "./create-task-form";

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

export default function TaskContainer({ tasks }: { tasks: Task[] }) {
  const dailyTasks = getDailyTasks(tasks);
  const otherTasks = tasks.filter(
    (task) => !dateFilter(task.dueDate) && !task.isExpired,
  );
  const expiredTasks = tasks.filter((task) => task.isExpired);

  return (
    <div className="animate-fade-in p-8">
      <CreateTaskForm />
      <div className="space-y-2">
        {tasks.length === 0 ? (
          <p className="text-neutral-500 text-center">
            No tasks yet. Create a new one!
          </p>
        ) : (
          <div className="space-y-4">
            {expiredTasks.length != 0 && (
              <>
                <p className="text-lg flex gap-2 items-center font-space text-red-500/70">
                  <TriangleAlert size={18} />
                  Overdue
                </p>
                {expiredTasks.map((task) => (
                  <TaskCard task={task} key={task._id?.toString()} />
                ))}
              </>
            )}
            {dailyTasks.length != 0 && (
              <>
                <p className="text-lg font-space text-neutral-400">Daily</p>
                {dailyTasks.map((task) => (
                  <TaskCard task={task} key={task._id?.toString()} />
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
                <TaskCard task={task} key={task._id?.toString()} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
