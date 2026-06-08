import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import createTagService from "../create-tag-service";
import { connectMongoose } from "@/infra/db/mongoose/mongoose";
import { TagModel } from "@/infra/db/mongoose/models";

vi.mock("@/infra/db/mongoose/mongoose", () => ({
  connectMongoose: vi.fn(),
}));

vi.mock("@/infra/db/mongoose/models", () => ({
  TagModel: {
    create: vi.fn(),
    exists: vi.fn(),
  },
}));

const makeCreateTagDTO = () => ({
  title: "Work",
  color: "#991b1b",
  description: "Tasks related to work.",
  userId: "valid_user_id",
});

const makeTag = () => ({
  _id: "507f1f77bcf86cd799439011",
  ...makeCreateTagDTO(),
});

describe("CreateTagService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(TagModel.exists as Mock).mockResolvedValue(null);
    vi.mocked(TagModel.create as Mock).mockResolvedValue(makeTag());
  });

  it("Should connect to mongoose before creating a tag.", async () => {
    await createTagService(makeCreateTagDTO());

    expect(connectMongoose).toHaveBeenCalledOnce();
  });

  it("Should verify title uniqueness for the current user.", async () => {
    await createTagService(makeCreateTagDTO());

    expect(TagModel.exists).toHaveBeenCalledOnce();
    expect(TagModel.exists).toHaveBeenCalledWith({
      userId: "valid_user_id",
      title: expect.any(RegExp),
    });
  });

  it("Should create a tag with correct values.", async () => {
    const createTagDTO = makeCreateTagDTO();

    await createTagService(createTagDTO);

    expect(TagModel.create).toHaveBeenCalledWith(createTagDTO);
  });

  it("Should return a tag on success.", async () => {
    const result = await createTagService(makeCreateTagDTO());

    expect(result).toEqual(makeTag());
  });

  it("Should throw conflict AppError if title already exists.", async () => {
    vi.mocked(TagModel.exists as Mock).mockResolvedValueOnce({ _id: "tag_id" });

    await expect(createTagService(makeCreateTagDTO())).rejects.toMatchObject({
      statusCode: 409,
      code: "TAG_ALREADY_EXISTS",
      message: "You already have a tag with this title.",
    });
    expect(TagModel.create).not.toHaveBeenCalled();
  });

  it("Should throw formatted database error if TagModel throws.", async () => {
    vi.mocked(TagModel.create as Mock).mockRejectedValueOnce(
      new Error("Connection lost."),
    );

    await expect(createTagService(makeCreateTagDTO())).rejects.toMatchObject({
      statusCode: 500,
      code: "DATABASE_ERROR",
      message: "It was not possible to create the tag at this time.",
    });
  });
});
