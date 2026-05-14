import { NotFound } from "@/errors";
import { AppError } from "@/errors/app-error";
import { TaskModel } from "@/infra/db/mongoose/models";
import { connectMongoose } from "@/infra/db/mongoose/mongoose";

interface DeleteTaskDTO {
  userId: string;
  taskId: string;
}

export default async function deleteTaskService(deleteTaskDTO: DeleteTaskDTO) {
  await connectMongoose();

  try {
    const { taskId: _id, userId } = deleteTaskDTO;
    const res = await TaskModel.findOneAndDelete({
      _id,
      userId,
    }).lean();
    if (!res) {
      throw new NotFound("Task not found.");
    }
    return { success: true };
  } catch (error: unknown) {
    if (error instanceof AppError) throw error;
    console.error("Internal server error while deleting task: ", error);
    throw new AppError(
      "It was not possible to delete the task at this time.",
      500,
      "DATABASE_ERROR",
    );
  }
}
