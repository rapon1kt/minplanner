import { beforeEach, describe, expect, it, vi } from "vitest";
import deleteTaskService from "../delete-task-service";
import { TaskModel } from "@/infra/db/mongoose/models";
import { AppError } from "@/errors/app-error";

vi.mock("@/infra/db/mongoose/mongoose", () => ({
  connectMongoose: vi.fn(),
}));

const mockLean = vi.fn();
vi.mock("@/infra/db/mongoose/models", () => ({
  TaskModel: {
    findOneAndDelete: vi.fn(() => ({
      lean: mockLean,
    })),
  },
}));

describe("DeleteTaskService", () => {
  const mockedTaskId = "507f1f77bcf86cd799439011";
  const mockedUserId = "valid_user_id";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Should delete a task with success.", async () => {
    mockLean.mockResolvedValueOnce({
      _id: mockedTaskId,
      userId: mockedUserId,
    });

    const result = await deleteTaskService({
      taskId: mockedTaskId,
      userId: mockedUserId,
    });

    expect(result.success).toBe(true);
    expect(TaskModel.findOneAndDelete).toHaveBeenCalledExactlyOnceWith({
      _id: mockedTaskId,
      userId: mockedUserId,
    });
  });

  it("Should throw AppError 404 if the task does not exist or belongs to another user", async () => {
    mockLean.mockReturnValueOnce(null);

    await expect(
      deleteTaskService({
        taskId: mockedTaskId,
        userId: mockedUserId,
      }),
    ).rejects.toMatchObject({
      statusCode: 404,
      code: "NOT_FOUND",
    });
  });

  it("Should throw AppError 500 if database connection fall", async () => {
    mockLean.mockRejectedValueOnce(new Error("Lost connection."));

    await expect(
      deleteTaskService({
        taskId: mockedTaskId,
        userId: mockedUserId,
      }),
    ).rejects.toMatchObject({
      statusCode: 500,
      code: "DATABASE_ERROR",
    });
  });
});
