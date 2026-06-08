import { beforeEach, describe, expect, it, vi } from "vitest";
import getTagsService from "../get-tags-service";
import { connectMongoose } from "@/infra/db/mongoose/mongoose";
import { TagModel } from "@/infra/db/mongoose/models";

vi.mock("@/infra/db/mongoose/mongoose", () => ({
  connectMongoose: vi.fn(),
}));

const mockLean = vi.fn();
const mockSort = vi.fn(() => ({
  lean: mockLean,
}));

vi.mock("@/infra/db/mongoose/models", () => ({
  TagModel: {
    find: vi.fn(() => ({
      sort: mockSort,
    })),
  },
}));

const makeTags = () => [
  {
    _id: "507f1f77bcf86cd799439011",
    title: "Personal",
    color: "#166534",
    userId: "valid_user_id",
  },
  {
    _id: "507f1f77bcf86cd799439012",
    title: "Work",
    color: "#991b1b",
    userId: "valid_user_id",
  },
];

describe("GetTagsService", () => {
  const mockedUserId = "valid_user_id";

  beforeEach(() => {
    vi.clearAllMocks();
    mockLean.mockResolvedValue(makeTags());
  });

  it("Should list user tags sorted by title.", async () => {
    const result = await getTagsService(mockedUserId);

    expect(connectMongoose).toHaveBeenCalledOnce();
    expect(TagModel.find).toHaveBeenCalledExactlyOnceWith({
      userId: mockedUserId,
    });
    expect(mockSort).toHaveBeenCalledExactlyOnceWith({ title: 1 });
    expect(mockLean).toHaveBeenCalledOnce();
    expect(result).toEqual(makeTags());
  });

  it("Should throw formatted database error if list fails.", async () => {
    mockLean.mockRejectedValueOnce(new Error("Connection lost."));

    await expect(getTagsService(mockedUserId)).rejects.toMatchObject({
      statusCode: 500,
      code: "DATABASE_ERROR",
      message: "It was not possible to list tags at this time.",
    });
  });
});
