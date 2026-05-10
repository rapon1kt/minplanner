import { AppError } from "@/errors/app-error";
import { TaskModel } from "@/infra/db/mongoose/models";
import { connectMongoose } from "@/infra/db/mongoose/mongoose";

interface CreateTaskDTO {
  title: string;
  userId: string;
  dueDate?: Date;
  severity?: string;
  description?: string;
}

export default async function createTaskService(createTaskDTO: CreateTaskDTO) {
  await connectMongoose();

  try {
    const newTask = await TaskModel.create(createTaskDTO);
    return newTask.toObject();
  } catch (error: unknown) {
    console.error("Internal mongoose error: ", error);

    throw new AppError(
      "It was not possible to create the task at this time.",
      500,
      "DATABASE_ERROR",
    );
  }
}
