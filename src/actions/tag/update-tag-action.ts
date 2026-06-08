"use server";
import z from "zod";
import { AppError } from "@/errors/app-error";
import { getVerifiedUser } from "@/lib/verify-auth";
import { revalidatePath } from "next/cache";
import { updateTagSchema } from "@/schemas";
import { updateTagService } from "@/services/tag";

type Properties = {
  tagId?: { errors: string[] };
  title?: { errors: string[] };
  color?: { errors: string[] };
  description?: { errors: string[] };
};

type UpdateTagState = {
  success: boolean;
  message: string;
  errors?: Properties;
  errorCode?: string;
};

export default async function updateTagAction(
  prevState: unknown,
  formData: FormData,
): Promise<UpdateTagState> {
  const rawData = {
    tagId: formData.get("tagId"),
    title: formData.get("title"),
    color: formData.get("color"),
    description: formData.get("description"),
  };

  const validatedFields = updateTagSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: z.treeifyError(validatedFields.error).properties,
      message: "Invalid tag fields.",
    };
  }

  try {
    const { id: userId } = await getVerifiedUser();
    const { tagId, ...updateData } = validatedFields.data;

    await updateTagService(tagId, userId, updateData);
    revalidatePath("/");

    return {
      success: true,
      message: "Tag updated with success!",
    };
  } catch (error: unknown) {
    if (error instanceof AppError) {
      return {
        success: false,
        message: error.message,
        errorCode: error.code,
      };
    }

    console.error("An unexpected error occurred while updating tag: ", error);

    return {
      success: false,
      message: "Something went wrong while updating the tag.",
    };
  }
}
