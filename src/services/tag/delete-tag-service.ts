import { NotFound } from "@/errors";
import { AppError } from "@/errors/app-error";
import { TagModel, TaskModel } from "@/infra/db/mongoose/models";
import { connectMongoose } from "@/infra/db/mongoose/mongoose";

interface DeleteTagDTO {
  tagId: string;
  userId: string;
}

export default async function deleteTagService({ tagId, userId }: DeleteTagDTO) {
  await connectMongoose();

  try {
    const deletedTag = await TagModel.findOneAndDelete({
      _id: tagId,
      userId,
    }).lean();

    if (!deletedTag) {
      throw new NotFound("Tag not found.");
    }

    await TaskModel.updateMany(
      { userId, tags: tagId },
      { $pull: { tags: tagId } },
    );

    return { success: true };
  } catch (error: unknown) {
    if (error instanceof AppError) throw error;

    console.error("Internal mongoose error while deleting tag: ", error);

    throw new AppError(
      "It was not possible to delete the tag at this time.",
      500,
      "DATABASE_ERROR",
    );
  }
}
