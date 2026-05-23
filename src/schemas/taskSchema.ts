import { Types } from "mongoose";
import z from "zod";

const taskIdSchema = z.string().refine((val) => Types.ObjectId.isValid(val), {
  error: "Invalid ObjectId.",
});

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(3, { error: "The title must be at least 3 characters long." })
    .max(50, { error: "The title cannot exceed 50 characters." }),
  description: z
    .string()
    .max(300, { error: "The description cannot exceed 300 characters." })
    .optional(),
  severity: z
    .enum(["low", "medium", "high"], {
      error: "Select a valid severity.",
    })
    .optional(),
  dueDate: z
    .string()
    .optional()
    .transform((val) => (val === "" ? undefined : val))
    .transform((val) => {
      if (val) {
        const date = new Date(val);
        date.setUTCHours(23, 59, 59, 999);
        return date;
      }
      return undefined;
    })
    .refine(
      (date) => {
        if (!date) return true;
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        return date >= today;
      },
      { error: "The due date cannot be earlier than the current day." },
    ),
});

export const deleteTaskSchema = z.object({
  taskId: taskIdSchema,
});

export const updateTaskSchema = z.object({
  taskId: taskIdSchema,
  title: z
    .string()
    .min(3, { error: "The title must be at least 3 characters long." })
    .max(50, { error: "The title cannot exceed 50 characters." })
    .optional()
    .or(z.literal(""))
    .transform((val) => (val === "" ? undefined : val)),
  description: z
    .string()
    .max(300, { error: "The description cannot exceed 300 characters." })
    .optional()
    .transform((val) => (val === "" ? undefined : val)),
  severity: z
    .enum(["low", "medium", "high"], {
      error: "Select a valid severity.",
    })
    .optional(),
  isCompleted: z
    .enum(["true", "false"])
    .transform((value: string) => value == "true")
    .optional(),
  dueDate: z
    .string()
    .optional()
    .transform((val) => (val === "" ? undefined : val))
    .transform((val) => (val ? new Date(val) : undefined))
    .refine(
      (date) => {
        if (!date) return true;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date >= today;
      },
      { error: "The due date cannot be earlier than the current day." },
    ),
});
