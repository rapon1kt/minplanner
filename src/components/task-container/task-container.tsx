import TaskCard from "./task-card";
import { Task } from "@/core/domain/models";
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
  return tasks.filter((task) => dateFilter(task.dueDate) == true);
};

export default function TaskContainer({ tasks }: { tasks: Task[] }) {
  const dailyTasks = getDailyTasks(tasks);

  const otherTasks = tasks.filter((task) => dateFilter(task.dueDate) == false);

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
            {dailyTasks.length != 0 && (
              <>
                <p className="text-lg font-space text-neutral-400">
                  Daily Tasks
                </p>
                {dailyTasks.map((task) => (
                  <TaskCard task={task} key={task._id?.toString()} />
                ))}
                <div className="border border-neutral-800" />
              </>
            )}
            <p className="text-lg font-space text-neutral-400">
              {dailyTasks.length != 0 ? "Other Tasks" : "Tasks"}
            </p>
            {otherTasks.length == 0 ? (
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
