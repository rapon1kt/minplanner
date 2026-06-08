import { AppError } from "@/errors/app-error";
import { TaskModel } from "@/infra/db/mongoose/models";
import { connectMongoose } from "@/infra/db/mongoose/mongoose";
import { ensureTagsBelongToUser } from "@/services/tag/tag-service-utils";

interface CreateTaskDTO {
  title: string;
  userId: string;
  dueDate?: Date;
  severity?: string;
  description?: string;
  tags?: string[];
}

export default async function createTaskService(createTaskDTO: CreateTaskDTO) {
  await connectMongoose();

  try {
    const tags = await ensureTagsBelongToUser(
      createTaskDTO.tags,
      createTaskDTO.userId,
    );
    const taskPayload =
      tags.length > 0 ? { ...createTaskDTO, tags } : createTaskDTO;

    const newTask = await TaskModel.create(taskPayload);
    return newTask;
  } catch (error: unknown) {
    if (error instanceof AppError) throw error;

    console.error("Internal mongoose error: ", error);

    throw new AppError(
      "It was not possible to create the task at this time.",
      500,
      "DATABASE_ERROR",
    );
  }
}
