import { beforeEach, describe, it, Mock, vi } from "vitest";
import updateTagService from "../update-tag-service";
import { AppError } from "@/errors/app-error";
import { connectMongoose } from "@/infra/db/mongoose/mongoose";
import { TagModel } from "@/infra/db/mongoose/models";

vi.mock("@/infra/db/mongoose/mongoose", () => ({
  connectMongoose: vi.fn(),
}));

const mockLean = vi.fn();
vi.mock("@/infra/db/mongoose/models", () => ({
  TagModel: {
    exists: vi.fn(),
    findOneAndUpdate: vi.fn(() => ({
      lean: mockLean,
    })),
  },
}));

const makeUpdateTagDTO = () => ({
  title: "Work",
  color: "#991b1b",
  description: "Tasks related to work.",
});

const makeUpdatedTag = () => ({
  _id: "507f1f77bcf86cd799439011",
  userId: "valid_user_id",
  ...makeUpdateTagDTO(),
});

describe("UpdateTagService", () => {
  const mockedTagId = "507f1f77bcf86cd799439011";
  const mockedUserId = "valid_user_id";

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(TagModel.exists as Mock).mockResolvedValue(null);
  });

  it("Should update a tag with success.", async ({ expect }) => {
    mockLean.mockResolvedValueOnce(makeUpdatedTag());

    const result = await updateTagService(
      mockedTagId,
      mockedUserId,
      makeUpdateTagDTO(),
    );

    expect(connectMongoose).toHaveBeenCalledOnce();
    expect(TagModel.exists).toHaveBeenCalledWith({
      userId: mockedUserId,
      title: expect.any(RegExp),
      _id: { $ne: mockedTagId },
    });
    expect(TagModel.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: mockedTagId, userId: mockedUserId },
      { $set: makeUpdateTagDTO() },
      { returnDocument: "after", runValidators: true },
    );
    expect(mockLean).toHaveBeenCalledOnce();
    expect(result).toEqual({
      success: true,
      updatedTag: makeUpdatedTag(),
    });
  });

  it("Should throw NotFound if the tag does not exist or belongs to someone else.", async ({
    expect,
  }) => {
    mockLean.mockResolvedValueOnce(null);

    await expect(
      updateTagService(mockedTagId, mockedUserId, makeUpdateTagDTO()),
    ).rejects.toMatchObject({
      statusCode: 404,
      code: "NOT_FOUND",
    });
  });

  it("Should throw conflict AppError if title already exists.", async ({
    expect,
  }) => {
    vi.mocked(TagModel.exists as Mock).mockResolvedValueOnce({
      _id: "another_tag_id",
    });

    await expect(
      updateTagService(mockedTagId, mockedUserId, makeUpdateTagDTO()),
    ).rejects.toMatchObject({
      statusCode: 409,
      code: "TAG_ALREADY_EXISTS",
      message: "You already have a tag with this title.",
    });
    expect(TagModel.findOneAndUpdate).not.toHaveBeenCalled();
  });

  it("Should throw native exception if is instance of AppError.", async ({
    expect,
  }) => {
    const customError = new AppError(
      "Forced validation error",
      400,
      "VALIDATION_ERROR",
    );
    mockLean.mockRejectedValueOnce(customError);

    await expect(
      updateTagService(mockedTagId, mockedUserId, makeUpdateTagDTO()),
    ).rejects.toThrow(customError);
  });

  it("Should throw formatted database error if TagModel throws.", async ({
    expect,
  }) => {
    mockLean.mockRejectedValueOnce(new Error("Connection lost."));

    await expect(
      updateTagService(mockedTagId, mockedUserId, makeUpdateTagDTO()),
    ).rejects.toMatchObject({
      statusCode: 500,
      code: "DATABASE_ERROR",
      message: "It was not possible to update the tag at this time.",
    });
  });
});
