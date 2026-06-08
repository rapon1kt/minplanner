import { revalidatePath } from "next/cache";
import { deleteTagAction } from "@/actions/tag";
import { AppError } from "@/errors/app-error";
import { getVerifiedUser } from "@/lib/verify-auth";
import { deleteTagService } from "@/services/tag";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/verify-auth", () => ({
  getVerifiedUser: vi.fn(),
}));

vi.mock("@/services/tag", () => ({
  deleteTagService: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

const createMockFormData = (data: Record<string, string>) => {
  return {
    get: (key: string) => data[key] ?? undefined,
  } as unknown as FormData;
};

describe("DeleteTagAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getVerifiedUser).mockResolvedValue({
      id: "valid_user_id",
      name: "valid_user_name",
      email: "valid_user_email",
    });
    vi.mocked(deleteTagService).mockResolvedValue({
      success: true,
    });
  });

  it("Should delete a tag with success.", async () => {
    const result = await deleteTagAction(
      null,
      createMockFormData({
        tagId: "507f1f77bcf86cd799439011",
      }),
    );

    expect(result).toEqual({
      success: true,
      message: "Tag deleted with success!",
    });
    expect(result.errors).not.toBeDefined();
    expect(result.errorCode).not.toBeDefined();
    expect(deleteTagService).toHaveBeenCalledExactlyOnceWith({
      tagId: "507f1f77bcf86cd799439011",
      userId: "valid_user_id",
    });
    expect(revalidatePath).toHaveBeenCalledExactlyOnceWith("/");
  });

  it("Should return a validation error if no tagId is provided.", async () => {
    const result = await deleteTagAction(null, createMockFormData({}));

    expect(result.success).toBe(false);
    expect(result.errors?.tagId).toBeDefined();
    expect(result.message).toBe("Invalid tag id.");
    expect(deleteTagService).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("Should return a validation error if tagId is invalid.", async () => {
    const result = await deleteTagAction(
      null,
      createMockFormData({
        tagId: "507f1f77zcf86cd799439011",
      }),
    );

    expect(result.success).toBe(false);
    expect(result.errors?.tagId).toBeDefined();
    expect(result.message).toBe("Invalid tag id.");
    expect(deleteTagService).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("Should return an application error if DeleteTagService throws AppError.", async () => {
    vi.mocked(deleteTagService).mockRejectedValueOnce(
      new AppError(
        "It was not possible to delete the tag at this time.",
        500,
        "DATABASE_ERROR",
      ),
    );

    const result = await deleteTagAction(
      null,
      createMockFormData({
        tagId: "507f1f77bcf86cd799439011",
      }),
    );

    expect(result).toEqual({
      success: false,
      message: "It was not possible to delete the tag at this time.",
      errorCode: "DATABASE_ERROR",
    });
    expect(revalidatePath).not.toHaveBeenCalled();
  });
});
