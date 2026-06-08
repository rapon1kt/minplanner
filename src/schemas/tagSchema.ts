import { Types } from "mongoose";
import z from "zod";

const tagIdSchema = z.string().refine((val) => Types.ObjectId.isValid(val), {
  error: "Invalid ObjectId.",
});

export const createTagSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { error: "Title is required." })
    .max(20, { error: "Title cannot have more than 20 characteres." }),
  color: z
    .string()
    .trim()
    .min(1, { error: "Color is required." })
    .regex(/^#([0-9a-fA-F]{3}){1,2}$/, {
      error: "Invalid format of color. Use HEX.",
    }),
  description: z
    .string()
    .trim()
    .max(100, { error: "Description cannot have more than 100 characteres." })
    .optional()
    .or(z.literal(""))
    .transform((val) => (val === "" ? undefined : val)),
});

export const updateTagSchema = createTagSchema.extend({
  tagId: tagIdSchema,
});

export const deleteTagSchema = z.object({
  tagId: tagIdSchema,
});

export default createTagSchema;
