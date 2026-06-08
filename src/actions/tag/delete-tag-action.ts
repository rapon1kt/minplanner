"use server";
import z from "zod";
import { AppError } from "@/errors/app-error";
import { deleteTagSchema } from "@/schemas";
import { deleteTagService } from "@/services/tag";
import { getVerifiedUser } from "@/lib/verify-auth";
import { revalidatePath } from "next/cache";

type Properties = {
  tagId?: { errors: string[] };
};

type DeleteTagState = {
  success: boolean;
  message: string;
  errors?: Properties;
  errorCode?: string;
};

export default async function deleteTagAction(
  prevState: unknown,
  formData: FormData,
): Promise<DeleteTagState> {
  const rawData = {
    tagId: formData.get("tagId"),
  };

  const validatedFields = deleteTagSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: z.treeifyError(validatedFields.error).properties,
      message: "Invalid tag id.",
    };
  }

  try {
    const { id: userId } = await getVerifiedUser();
    const { tagId } = validatedFields.data;

    await deleteTagService({ tagId, userId });
    revalidatePath("/");

    return {
      success: true,
      message: "Tag deleted with success!",
    };
  } catch (error: unknown) {
    if (error instanceof AppError) {
      return {
        success: false,
        message: error.message,
        errorCode: error.code,
      };
    }

    console.error("An unexpected error occurred while deleting tag: ", error);

    return {
      success: false,
      message: "Something went wrong while deleting the tag.",
    };
  }
}
