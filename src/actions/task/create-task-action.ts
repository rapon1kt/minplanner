"use server";
import z from "zod";
import { createTaskSchema } from "@/schemas";
import { revalidatePath } from "next/cache";
import { createTaskService } from "@/services/task";
import { getVerifiedUser } from "@/lib/verify-auth";
import { AppError } from "@/errors/app-error";
import { Task } from "@/core/domain/models";

type Properties = {
  title?: { errors: string[] };
  description?: { errors: string[] };
  dueDate?: { errors: string[] };
  severity?: { errors: string[] };
};

type CreateTaskResponse = Promise<{
  success: boolean;
  message: string;
  newTask?: Task;
  errors?: Properties;
  errorCode?: string;
}>;

export default async function createTaskAction(
  prevState: unknown,
  formData: FormData,
): CreateTaskResponse {
  const { id: userId } = await getVerifiedUser();

  const rawData = {
    title: formData.get("title"),
    dueDate: formData.get("dueDate"),
    severity: formData.get("severity"),
    description: formData.get("description"),
  };

  const validatedFields = createTaskSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: z.treeifyError(validatedFields.error).properties,
      message: "Invalid fields value.",
    };
  }

  try {
    const { title, severity, description, dueDate } = validatedFields.data;

    const newTask = await createTaskService({
      title,
      userId,
      dueDate,
      severity,
      description,
    });

    revalidatePath("/");
    return { success: true, newTask, message: "Task created with success!" };
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
      message: "Something went wrong while creating new task.",
    };
  }
}
