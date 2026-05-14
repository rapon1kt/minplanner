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
});
