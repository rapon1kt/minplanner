import { revalidatePath } from "next/cache";
import { createTagAction } from "@/actions/tag";
import { AppError } from "@/errors/app-error";
import { getVerifiedUser } from "@/lib/verify-auth";
import { createTagService } from "@/services/tag";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/verify-auth", () => ({
  getVerifiedUser: vi.fn(),
}));

vi.mock("@/services/tag", () => ({
  createTagService: vi.fn(),
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
    title: "Work",
    color: "#991b1b",
    description: "Tasks related to work.",
  });

const makeTag = () => ({
  _id: "507f1f77bcf86cd799439011",
  title: "Work",
  color: "#991b1b",
  description: "Tasks related to work.",
  userId: "valid_user_id",
});

describe("CreateTagAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getVerifiedUser).mockResolvedValue({
      id: "valid_user_id",
      name: "valid_user_name",
      email: "valid_user_email",
    });
    vi.mocked(createTagService).mockResolvedValue(makeTag());
  });

  it("Should return a validation error if required fields are missing.", async () => {
    const result = await createTagAction(null, createMockFormData({}));

    expect(result.success).toBe(false);
    expect(result.errors?.title).toBeDefined();
    expect(result.errors?.color).toBeDefined();
    expect(result.message).toBe("Invalid tag fields.");
    expect(createTagService).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("Should return a validation error if fields are invalid.", async () => {
    const result = await createTagAction(
      null,
      createMockFormData({
        title: ".".repeat(21),
        color: "red",
        description: ".".repeat(101),
      }),
    );

    expect(result.success).toBe(false);
    expect(result.errors?.title).toBeDefined();
    expect(result.errors?.color).toBeDefined();
    expect(result.errors?.description).toBeDefined();
    expect(result.message).toBe("Invalid tag fields.");
    expect(createTagService).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("Should call CreateTagService with validated data and user id.", async () => {
    const result = await createTagAction(null, makeValidFormData());

    expect(result.success).toBe(true);
    expect(result.newTag).toEqual(makeTag());
    expect(createTagService).toHaveBeenCalledExactlyOnceWith({
      title: "Work",
      color: "#991b1b",
      description: "Tasks related to work.",
      userId: "valid_user_id",
    });
  });

  it("Should revalidate the home path on success.", async () => {
    await createTagAction(null, makeValidFormData());

    expect(revalidatePath).toHaveBeenCalledExactlyOnceWith("/");
  });

  it("Should return an application error if CreateTagService throws AppError.", async () => {
    vi.mocked(createTagService).mockRejectedValueOnce(
      new AppError("Tag already exists.", 409, "TAG_ALREADY_EXISTS"),
    );

    const result = await createTagAction(null, makeValidFormData());

    expect(result).toEqual({
      success: false,
      message: "Tag already exists.",
      errorCode: "TAG_ALREADY_EXISTS",
    });
    expect(revalidatePath).not.toHaveBeenCalled();
  });
});
