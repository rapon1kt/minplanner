import { beforeEach, describe, expect, it, vi } from "vitest";
import deleteTaskService from "../delete-task-service";
import { TaskModel } from "@/infra/db/mongoose/models";

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
});
