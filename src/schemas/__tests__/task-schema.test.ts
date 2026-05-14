import { taskSchema } from "@/schemas";
import { describe, expect, it } from "vitest";

const makeValidTaskData = () => ({
  title: "valid_title",
  description: "valid_description",
  severity: "low",
  dueDate: new Date(2030, 2, 26).toDateString(),
});

describe("TaskSchema", () => {
  it("Should parse valid task data.", () => {
    const result = taskSchema.safeParse(makeValidTaskData());

    expect(result.success).toBe(true);
    expect(result.data).toEqual({
      title: "valid_title",
      description: "valid_description",
      severity: "low",
      dueDate: new Date(2030, 2, 26),
    });
  });

  it("Should accept optional fields as empty values.", () => {
    const result = taskSchema.safeParse({
      title: "valid_title",
      description: "",
      severity: undefined,
      dueDate: "",
    });

    expect(result.success).toBe(true);
    expect(result.data).toEqual({
      title: "valid_title",
      description: "",
      severity: undefined,
      dueDate: undefined,
    });
  });

  it("Should reject missing title.", () => {
    const result = taskSchema.safeParse({});

    expect(result.success).toBe(false);
    expect(result.error?.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: ["title"],
        }),
      ]),
    );
  });

  it("Should reject title with less than 3 characters.", () => {
    const result = taskSchema.safeParse({
      ...makeValidTaskData(),
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

  it("Should reject title with more than 50 characters.", () => {
    const result = taskSchema.safeParse({
      ...makeValidTaskData(),
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

  it("Should reject description with more than 300 characters.", () => {
    const result = taskSchema.safeParse({
      ...makeValidTaskData(),
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

  it("Should reject invalid severity.", () => {
    const result = taskSchema.safeParse({
      ...makeValidTaskData(),
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

  it("Should reject dueDate before the current day.", () => {
    const result = taskSchema.safeParse({
      ...makeValidTaskData(),
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
