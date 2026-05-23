import { NotFound } from "@/errors";
import { AppError } from "@/errors/app-error";
import { TaskModel } from "@/infra/db/mongoose/models";
import { connectMongoose } from "@/infra/db/mongoose/mongoose";

interface UpdateTaskDTO {
  title?: string;
  dueDate?: Date;
  description?: string;
  isCompleted?: boolean;
  severity?: string;
}

export default async function updateTaskService(
  taskId: string,
  userId: string,
  updateTaskDTO: UpdateTaskDTO,
) {
  await connectMongoose();

  try {
    const updatedTask = await TaskModel.findOneAndUpdate(
      { _id: taskId, userId },
      { $set: updateTaskDTO },
      { returnDocument: "after" },
    ).lean();
    if (!updatedTask) {
      throw new NotFound("Task not found.");
    }
    return { success: true, updatedTask };
  } catch (error: unknown) {
    if (error instanceof AppError) throw error;
    console.error("Internal server error while updating task: ", error);
    throw new AppError(
      "It was not possible to update the task at this time.",
      500,
      "DATABASE_ERROR",
    );
  }
}
