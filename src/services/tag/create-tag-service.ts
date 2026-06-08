import { AppError } from "@/errors/app-error";
import { TagModel } from "@/infra/db/mongoose/models";
import { connectMongoose } from "@/infra/db/mongoose/mongoose";
import { ensureTagTitleIsAvailable } from "./tag-service-utils";

interface CreateTagDTO {
  title: string;
  color: string;
  description?: string;
  userId: string;
}

export default async function createTagService(createTagDTO: CreateTagDTO) {
  await connectMongoose();

  try {
    await ensureTagTitleIsAvailable(createTagDTO.title, createTagDTO.userId);

    const newTag = await TagModel.create(createTagDTO);
    return newTag;
  } catch (error: unknown) {
    if (error instanceof AppError) throw error;

    console.error("Internal mongoose error while creating tag: ", error);

    throw new AppError(
      "It was not possible to create the tag at this time.",
      500,
      "DATABASE_ERROR",
    );
  }
}
