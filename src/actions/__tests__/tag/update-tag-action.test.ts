import { revalidatePath } from "next/cache";
import { updateTagAction } from "@/actions/tag";
import { AppError } from "@/errors/app-error";
import { getVerifiedUser } from "@/lib/verify-auth";
import { updateTagService } from "@/services/tag";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/verify-auth", () => ({
  getVerifiedUser: vi.fn(),
}));

vi.mock("@/services/tag", () => ({
  updateTagService: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

const createMockFormData = (data: Record<string, string>) => {
  return {
    get: (key: string) => data[key] ?? undefined,
  } as unknown as FormData;
};

const makeValidFormData = () =>
  createMockFormData({
    tagId: "507f1f77bcf86cd799439011",
    title: "Work",
    color: "#991b1b",
    description: "Tasks related to work.",
  });

describe("UpdateTagAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getVerifiedUser).mockResolvedValue({
      id: "valid_user_id",
      name: "valid_user_name",
      email: "valid_user_email",
    });
    vi.mocked(updateTagService).mockResolvedValue({
      success: true,
      updatedTag: {
        _id: "507f1f77bcf86cd799439011",
        title: "Work",
        color: "#991b1b",
        userId: "valid_user_id",
      },
    });
  });

  it("Should update a tag with success.", async () => {
    const result = await updateTagAction(null, makeValidFormData());

    expect(result).toEqual({
      success: true,
      message: "Tag updated with success!",
    });
    expect(result.errors).not.toBeDefined();
    expect(result.errorCode).not.toBeDefined();
    expect(updateTagService).toHaveBeenCalledExactlyOnceWith(
      "507f1f77bcf86cd799439011",
      "valid_user_id",
      {
        title: "Work",
        color: "#991b1b",
        description: "Tasks related to work.",
      },
    );
    expect(revalidatePath).toHaveBeenCalledExactlyOnceWith("/");
  });

  it("Should return a validation error if tagId is missing.", async () => {
    const result = await updateTagAction(null, createMockFormData({}));

    expect(result.success).toBe(false);
    expect(result.errors?.tagId).toBeDefined();
    expect(result.message).toBe("Invalid tag fields.");
    expect(updateTagService).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("Should return a validation error if fields are invalid.", async () => {
    const result = await updateTagAction(
      null,
      createMockFormData({
        tagId: "507f1f77zcf86cd799439011",
        title: ".".repeat(21),
        color: "red",
        description: ".".repeat(101),
      }),
    );

    expect(result.success).toBe(false);
    expect(result.errors?.tagId).toBeDefined();
    expect(result.errors?.title).toBeDefined();
    expect(result.errors?.color).toBeDefined();
    expect(result.errors?.description).toBeDefined();
    expect(result.message).toBe("Invalid tag fields.");
    expect(updateTagService).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("Should return an application error if UpdateTagService throws AppError.", async () => {
    vi.mocked(updateTagService).mockRejectedValueOnce(
      new AppError("Tag not found.", 404, "NOT_FOUND"),
    );

    const result = await updateTagAction(null, makeValidFormData());

    expect(result).toEqual({
      success: false,
      message: "Tag not found.",
      errorCode: "NOT_FOUND",
    });
    expect(revalidatePath).not.toHaveBeenCalled();
  });
});
