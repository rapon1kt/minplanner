import { AppError } from "@/errors/app-error";
import { TaskModel } from "@/infra/db/mongoose/models";
import { connectMongoose } from "@/infra/db/mongoose/mongoose";

export default async function expireTasksService(now = Date.now()) {
  await connectMongoose();

  try {
    const result = await TaskModel.updateMany(
      {
        dueDate: { $lt: new Date(now) },
        isExpired: false,
        isCompleted: false,
      },
      {
        isExpired: true,
      },
    );

    return {
      success: true,
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    };
  } catch (error: unknown) {
    console.error("Internal mongoose error while expiring tasks: ", error);

    throw new AppError(
      "It was not possible to expire tasks at this time.",
      500,
      "DATABASE_ERROR",
    );
  }
}
