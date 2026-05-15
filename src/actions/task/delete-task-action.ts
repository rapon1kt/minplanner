import { AppError } from "@/errors/app-error";
import { getVerifiedUser } from "@/lib/verify-auth";
import { deleteTaskSchema } from "@/schemas";
import { deleteTaskService } from "@/services/task";
import { revalidatePath } from "next/cache";
import z from "zod";

type Properties = {
  taskId?: { errors: string[] };
};

type DeleteTaskResponse = Promise<{
  success: boolean;
  message: string;
  errors?: Properties;
  errorCode?: string;
}>;

export default async function deleteTaskAction(
  prevState: unknown,
  formData: FormData,
): DeleteTaskResponse {
  const { id: userId } = await getVerifiedUser();

  const rawData = {
    taskId: formData.get("taskId"),
  };

  const validatedFields = deleteTaskSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: z.treeifyError(validatedFields.error).properties,
      message: "Invalid TaskId.",
    };
  }

  try {
    const { taskId } = validatedFields.data;
    const res = await deleteTaskService({ taskId, userId });
    revalidatePath("/");
    return {
      success: res.success,
      message: "Task deleted with success!",
    };
  } catch (error: unknown) {
    if (error instanceof AppError) {
      return {
        success: false,
        message: error.message,
        errorCode: error.code,
      };
    }

    console.error("An unexpected error occurred: ", error);

    return {
      success: false,
      message: "Something went wrong while deleting the task.",
    };
  }
}
