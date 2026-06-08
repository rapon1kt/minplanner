import {
  createTagSchema,
  deleteTagSchema,
  updateTagSchema,
} from "@/schemas";
import { describe, expect, it } from "vitest";

const validTagId = "507f1f77bcf86cd799439011";

const makeValidTagData = () => ({
  title: "Work",
  color: "#991b1b",
  description: "Tasks related to work.",
});

describe("CreateTagSchema", () => {
  it("Should parse valid tag data.", () => {
    const result = createTagSchema.safeParse(makeValidTagData());

    expect(result.success).toBe(true);
    expect(result.data).toEqual(makeValidTagData());
  });

  it("Should trim text fields and convert empty description to undefined.", () => {
    const result = createTagSchema.safeParse({
      title: "  Personal  ",
      color: "  #166534  ",
      description: "",
    });

    expect(result.success).toBe(true);
    expect(result.data).toEqual({
      title: "Personal",
      color: "#166534",
      description: undefined,
    });
  });

  it("Should reject missing required fields.", () => {
    const result = createTagSchema.safeParse({});

    expect(result.success).toBe(false);
    expect(result.error?.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: ["title"] }),
        expect.objectContaining({ path: ["color"] }),
      ]),
    );
  });

  it("Should reject invalid color format.", () => {
    const result = createTagSchema.safeParse({
      ...makeValidTagData(),
      color: "red",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: ["color"],
          message: "Invalid format of color. Use HEX.",
        }),
      ]),
    );
  });

  it("Should reject title and description above max length.", () => {
    const result = createTagSchema.safeParse({
      title: ".".repeat(21),
      color: "#991b1b",
      description: ".".repeat(101),
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: ["title"],
          message: "Title cannot have more than 20 characteres.",
        }),
        expect.objectContaining({
          path: ["description"],
          message: "Description cannot have more than 100 characteres.",
        }),
      ]),
    );
  });
});

describe("UpdateTagSchema", () => {
  it("Should parse valid update tag data.", () => {
    const result = updateTagSchema.safeParse({
      tagId: validTagId,
      ...makeValidTagData(),
    });

    expect(result.success).toBe(true);
    expect(result.data).toEqual({
      tagId: validTagId,
      ...makeValidTagData(),
    });
  });

  it("Should reject invalid tagId.", () => {
    const result = updateTagSchema.safeParse({
      tagId: "507f1f77zcf86cd799439011",
      ...makeValidTagData(),
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: ["tagId"],
          message: "Invalid ObjectId.",
        }),
      ]),
    );
  });
});

describe("DeleteTagSchema", () => {
  it("Should approve a valid object id.", () => {
    const result = deleteTagSchema.safeParse({ tagId: validTagId });

    expect(result.success).toBe(true);
  });

  it("Should reject invalid object id.", () => {
    const result = deleteTagSchema.safeParse({
      tagId: "507f1f77zcf86cd799439011",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Invalid ObjectId.");
  });
});
