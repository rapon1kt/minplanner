import { describe, expect, it } from "vitest";
import { deleteTaskSchema } from "../taskSchema";

const makeValidTaskIdFormData = () => ({
  taskId: "507f1f77bcf86cd799439011",
});

describe("DeleteTaskSchema", () => {
  it("Should approve a valid object id.", () => {
    const result = deleteTaskSchema.safeParse(makeValidTaskIdFormData());
    expect(result.success).toBe(true);
  });
});
