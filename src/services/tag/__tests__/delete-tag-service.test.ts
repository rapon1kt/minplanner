import { beforeEach, describe, expect, it, vi } from "vitest";
import deleteTagService from "../delete-tag-service";
import { connectMongoose } from "@/infra/db/mongoose/mongoose";
import { TagModel, TaskModel } from "@/infra/db/mongoose/models";

vi.mock("@/infra/db/mongoose/mongoose", () => ({
  connectMongoose: vi.fn(),
}));

const mockLean = vi.fn();
vi.mock("@/infra/db/mongoose/models", () => ({
  TagModel: {
    findOneAndDelete: vi.fn(() => ({
      lean: mockLean,
    })),
  },
  TaskModel: {
    updateMany: vi.fn(),
  },
}));

describe("DeleteTagService", () => {
  const mockedTagId = "507f1f77bcf86cd799439011";
  const mockedUserId = "valid_user_id";

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(TaskModel.updateMany).mockResolvedValue({
      acknowledged: true,
      matchedCount: 2,
      modifiedCount: 2,
      upsertedCount: 0,
      upsertedId: null,
    });
  });

  it("Should delete a tag with success and remove it from tasks.", async () => {
    mockLean.mockResolvedValueOnce({
      _id: mockedTagId,
      userId: mockedUserId,
    });

    const result = await deleteTagService({
      tagId: mockedTagId,
      userId: mockedUserId,
    });

    expect(connectMongoose).toHaveBeenCalledOnce();
    expect(result.success).toBe(true);
    expect(TagModel.findOneAndDelete).toHaveBeenCalledExactlyOnceWith({
      _id: mockedTagId,
      userId: mockedUserId,
    });
    expect(TaskModel.updateMany).toHaveBeenCalledExactlyOnceWith(
      { userId: mockedUserId, tags: mockedTagId },
      { $pull: { tags: mockedTagId } },
    );
  });

  it("Should throw NotFound if the tag does not exist or belongs to someone else.", async () => {
    mockLean.mockResolvedValueOnce(null);

    await expect(
      deleteTagService({
        tagId: mockedTagId,
        userId: mockedUserId,
      }),
    ).rejects.toMatchObject({
      statusCode: 404,
      code: "NOT_FOUND",
    });
    expect(TaskModel.updateMany).not.toHaveBeenCalled();
  });

  it("Should throw formatted database error if delete fails.", async () => {
    mockLean.mockRejectedValueOnce(new Error("Connection lost."));

    await expect(
      deleteTagService({
        tagId: mockedTagId,
        userId: mockedUserId,
      }),
    ).rejects.toMatchObject({
      statusCode: 500,
      code: "DATABASE_ERROR",
      message: "It was not possible to delete the tag at this time.",
    });
  });
});
