import { AppError } from "@/errors/app-error";
import { getVerifiedUser } from "@/lib/verify-auth";
import { updateTaskSchema } from "@/schemas/taskSchema";
import { updateTaskService } from "@/services/task";
import { revalidatePath } from "next/cache";
import z from "zod";

type Properties = {
  taskId?: { errors: string[] };
};

type UpdateTaskResponse = {
  success: boolean;
  message: string;
  errors?: Properties;
  errorCode?: string;
};

export default async function updateTaskAction(
  prevState: unknown,
  formData: FormData,
): Promise<UpdateTaskResponse> {
  const rawData = Object.fromEntries(
    ["taskId", "title", "severity", "description", "dueDate", "isCompleted"]
      .map((field) => [field, formData.get(field)])
      .filter(([, value]) => value !== null),
  );

  const validatedFields = updateTaskSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: z.treeifyError(validatedFields.error).properties,
      message: "Invalid fields.",
    };
  }

  try {
    const { id: userId } = await getVerifiedUser();

    const { taskId, ...updateData } = validatedFields.data;
    await updateTaskService(taskId, userId, updateData);
    revalidatePath("/");
    return { success: true, message: "Task updated with success." };
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
      message: "Something went wrong while updating the task.",
    };
  }
}
