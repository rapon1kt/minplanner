import z from "zod";

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
