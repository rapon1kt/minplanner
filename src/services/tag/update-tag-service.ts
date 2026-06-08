import { NotFound } from "@/errors";
import { AppError } from "@/errors/app-error";
import { TagModel } from "@/infra/db/mongoose/models";
import { connectMongoose } from "@/infra/db/mongoose/mongoose";
import { ensureTagTitleIsAvailable } from "./tag-service-utils";

interface UpdateTagDTO {
  title: string;
  color: string;
  description?: string;
}

export default async function updateTagService(
  tagId: string,
  userId: string,
  updateTagDTO: UpdateTagDTO,
) {
  await connectMongoose();

  try {
    await ensureTagTitleIsAvailable(updateTagDTO.title, userId, tagId);

    const updatedTag = await TagModel.findOneAndUpdate(
      { _id: tagId, userId },
      { $set: updateTagDTO },
      { returnDocument: "after", runValidators: true },
    ).lean();

    if (!updatedTag) {
      throw new NotFound("Tag not found.");
    }

    return { success: true, updatedTag };
  } catch (error: unknown) {
    if (error instanceof AppError) throw error;

    console.error("Internal mongoose error while updating tag: ", error);

    throw new AppError(
      "It was not possible to update the tag at this time.",
      500,
      "DATABASE_ERROR",
    );
  }
}
