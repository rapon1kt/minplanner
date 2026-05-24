"use server";
import createTaskAction from "./create-task-action";
import deleteTaskAction from "./delete-task-action";
import updateTaskAction from "./update-task-action";

export async function createTask(formData: FormData): Promise<void> {
  "use server";
  await createTaskAction(null, formData);
}

export async function deleteTask(formData: FormData): Promise<void> {
  "use server";
  await deleteTaskAction(null, formData);
}

export async function updateTask(formData: FormData): Promise<void> {
  "use server";
  await updateTaskAction(null, formData);
}
