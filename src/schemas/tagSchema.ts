import z from "zod";

const tagSchema = z.object({
  title: z
    .string()
    .min(1, { error: "Title is required." })
    .max(20, { error: "Title cannot have more than 20 characteres." }),
  color: z
    .string()
    .min(1, { error: "Color is required." })
    .regex(/^#([0-9a-fA-F]{3}){1,2}$/, {
      error: "Invalid format of color. Use HEX.",
    }),
  description: z
    .string()
    .max(100, { error: "Description cannot have more than 100 characteres." })
    .optional()
    .or(z.literal("")),
});

export default tagSchema;
