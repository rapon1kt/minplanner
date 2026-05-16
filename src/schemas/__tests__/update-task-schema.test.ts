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

  it("Should accept optional fields as undefined values.", ({ expect }) => {
    const result = updateTaskSchema.safeParse({
      title: "",
      dueDate: "",
      description: "",
      severity: undefined,
      taskId: "507f1f77bcf86cd799439011",
    });

    expect(result.success).toBe(true);
    expect(result.data).toEqual({
      title: undefined,
      description: undefined,
      dueDate: undefined,
      severity: undefined,
      taskId: "507f1f77bcf86cd799439011",
    });
  });

  it("Should reject missing taskId.", ({ expect }) => {
    const result = updateTaskSchema.safeParse({});

    expect(result.success).toBe(false);
    expect(result.error?.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: ["taskId"],
        }),
      ]),
    );
  });

  it("Should reject title with less than 3 characters.", ({ expect }) => {
    const result = updateTaskSchema.safeParse({
      ...makeValidUpdateTaskData(),
      title: "12",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: ["title"],
          message: "The title must be at least 3 characters long.",
        }),
      ]),
    );
  });

  it("Should reject title with more than 50 characters.", ({ expect }) => {
    const result = updateTaskSchema.safeParse({
      ...makeValidUpdateTaskData(),
      title: ".".repeat(51),
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: ["title"],
          message: "The title cannot exceed 50 characters.",
        }),
      ]),
    );
  });

  it("Should reject description with more than 300 characters.", ({
    expect,
  }) => {
    const result = updateTaskSchema.safeParse({
      ...makeValidUpdateTaskData(),
      description: ".".repeat(301),
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: ["description"],
          message: "The description cannot exceed 300 characters.",
        }),
      ]),
    );
  });

  it("Should reject invalid severity.", ({ expect }) => {
    const result = updateTaskSchema.safeParse({
      ...makeValidUpdateTaskData(),
      severity: "invalid_severity",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: ["severity"],
          message: "Select a valid severity.",
        }),
      ]),
    );
  });

  it("Should reject dueDate before the current day.", ({ expect }) => {
    const result = updateTaskSchema.safeParse({
      ...makeValidUpdateTaskData(),
      dueDate: new Date(2007, 3, 26).toDateString(),
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: ["dueDate"],
          message: "The due date cannot be earlier than the current day.",
        }),
      ]),
    );
  });
});
