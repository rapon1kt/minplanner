import { AppError } from "@/errors/app-error";
import { TagModel } from "@/infra/db/mongoose/models";
import { connectMongoose } from "@/infra/db/mongoose/mongoose";

export default async function getTagsService(userId: string) {
  await connectMongoose();

  try {
    return await TagModel.find({ userId }).sort({ title: 1 }).lean();
  } catch (error: unknown) {
    console.error("Internal mongoose error while listing tags: ", error);

    throw new AppError(
      "It was not possible to list tags at this time.",
      500,
      "DATABASE_ERROR",
    );
  }
}
