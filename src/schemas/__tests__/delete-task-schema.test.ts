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

  it("Should reject if the id length have less than 24 chars", () => {
    const shortId = "507f1f77bcf86cd79943901";
    const result = deleteTaskSchema.safeParse({ taskId: shortId });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Invalid ObjectId.");
  });

  it("Should reject if the id length have more than 24 chars", () => {
    const bigId = "507f1f77bcf86cd7994390112";
    const result = deleteTaskSchema.safeParse({ taskId: bigId });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Invalid ObjectId.");
  });

  it("Should reject if id contains non-hexa chars", () => {
    const idWithInvalidChars = "507f1fz7bcf86cd799439011";
    const result = deleteTaskSchema.safeParse({ taskId: idWithInvalidChars });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Invalid ObjectId.");
  });

  it("Should reject if the id is empty", () => {
    const emptyId = "";
    const result = deleteTaskSchema.safeParse({ taskId: emptyId });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Invalid ObjectId.");
  });
});
