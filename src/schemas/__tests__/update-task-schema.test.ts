import { describe, it } from "vitest";
import { updateTaskSchema } from "../taskSchema";

const makeValidUpdateTaskData = () => ({
  severity: "low",
  title: "valid_title",
  description: "valid_description",
  taskId: "507f1f77bcf86cd799439011",
  dueDate: new Date(2030, 2, 26).toDateString(),
});

describe("UpdateTaskSchema", () => {
  it("Should parse valid update task data.", async ({ expect }) => {
    const result = updateTaskSchema.safeParse(makeValidUpdateTaskData());
    expect(result.success).toBe(true);
    expect(result.data).toEqual({
      severity: "low",
      title: "valid_title",
      dueDate: new Date(2030, 2, 26),
      description: "valid_description",
      taskId: "507f1f77bcf86cd799439011",
    });
  });
});
