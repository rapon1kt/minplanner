"use server";
import z from "zod";
import { AppError } from "@/errors/app-error";
import { Tag } from "@/core/domain/models";
import { createTagSchema } from "@/schemas";
import { createTagService } from "@/services/tag";
import { getVerifiedUser } from "@/lib/verify-auth";
import { revalidatePath } from "next/cache";

type Properties = {
  title?: { errors: string[] };
  color?: { errors: string[] };
  description?: { errors: string[] };
};

type CreateTagState = {
  success: boolean;
  message: string;
  newTag?: Tag;
  errors?: Properties;
  errorCode?: string;
};

export default async function createTagAction(
  prevState: unknown,
  formData: FormData,
): Promise<CreateTagState> {
  const rawData = {
    title: formData.get("title"),
    color: formData.get("color"),
    description: formData.get("description"),
  };

  const validatedFields = createTagSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: z.treeifyError(validatedFields.error).properties,
      message: "Invalid tag fields.",
    };
  }

  try {
    const { id: userId } = await getVerifiedUser();
    const newTag = await createTagService({
      ...validatedFields.data,
      userId,
    });

    revalidatePath("/");

    return {
      success: true,
      newTag: JSON.parse(JSON.stringify(newTag)),
      message: "Tag created with success!",
    };
  } catch (error: unknown) {
    if (error instanceof AppError) {
      return {
        success: false,
        message: error.message,
        errorCode: error.code,
      };
    }

    console.error("An unexpected error occurred while creating tag: ", error);

    return {
      success: false,
      message: "Something went wrong while creating the tag.",
    };
  }
}
