import { createTask } from "@/actions/task/form-actions";
import { Plus } from "lucide-react";

export default function CreateTaskForm() {
  return (
    <div className="mb-8">
      <form
        action={createTask}
        className="flex flex-col md:flex-row md:items-end gap-2"
      >
        <div className="flex flex-col gap-1 flex-1">
          <label
            className="text-neutral-400 font-space text-xs "
            htmlFor="title"
          >
            Title
          </label>
          <input
            required
            name="title"
            type="text"
            placeholder="Add new task ..."
            className="font-barlow py-2 bg-neutral-900 border border-neutral-800 rounded-sm px-2 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:bg-neutral-800 focus:border-red-900 transition-all"
          />
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <label
            className="text-neutral-400 font-space text-xs "
            htmlFor="description"
          >
            Description
          </label>
          <input
            required
            type="text"
            name="description"
            placeholder="Type a short description about..."
            contentEditable={true}
            className="font-barlow py-2 flex-1 bg-neutral-900 border border-neutral-800 rounded-sm px-2 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:bg-neutral-800 focus:border-red-900 transition-all"
          />
        </div>

        <div className="flex flex-col gap-1 flex-1">
          <label
            className="text-neutral-400 font-space text-xs "
            htmlFor="dueDate"
          >
            Due Date
          </label>
          <input
            name="dueDate"
            type="date"
            className="font-barlow py-2 bg-neutral-900 border border-neutral-800 rounded-sm px-2 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:bg-neutral-800 focus:border-red-900 transition-all"
          />
        </div>

        <div className="flex flex-col gap-1 flex-1">
          <label
            className="text-neutral-400 font-space text-xs "
            htmlFor="severity"
          >
            Priority
          </label>
          <select
            name="severity"
            defaultValue=""
            className="cursor-pointer font-barlow py-2.5 bg-neutral-900 border border-neutral-800 rounded-sm px-2 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:bg-neutral-800 focus:border-red-900 transition-all"
          >
            <option value="">None</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <button
          type="submit"
          aria-label="Create task"
          className="cursor-pointer py-3 justify-center font-barlow bg-red-900/70 text-white rounded-sm px-3 hover:bg-red-800/50 transition-colors flex items-center gap-2 font-normal tracking-wide"
        >
          <Plus size={18} />
        </button>
      </form>
    </div>
  );
}
