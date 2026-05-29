import { beforeEach, describe, it, vi } from "vitest";
import expireTasksService from "../expire-tasks-service";
import { connectMongoose } from "@/infra/db/mongoose/mongoose";
import { TaskModel } from "@/infra/db/mongoose/models";

vi.mock("@/infra/db/mongoose/mongoose", () => ({
  connectMongoose: vi.fn(),
}));

vi.mock("@/infra/db/mongoose/models", () => ({
  TaskModel: {
    updateMany: vi.fn(),
  },
}));

describe("ExpireTasksService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Should expire pending tasks with dueDate before the provided date", async ({
    expect,
  }) => {
    const now = Date.now();
    vi.mocked(TaskModel.updateMany).mockResolvedValueOnce({
      acknowledged: true,
      matchedCount: 3,
      modifiedCount: 3,
      upsertedCount: 0,
      upsertedId: null,
    });

    const result = await expireTasksService(now);

    expect(connectMongoose).toHaveBeenCalledOnce();
    expect(TaskModel.updateMany).toHaveBeenCalledWith(
      {
        dueDate: { $lt: new Date(now) },
        isCompleted: false,
        isExpired: false,
      },
      { isExpired: true },
    );
    expect(result).toEqual({
      success: true,
      matchedCount: 3,
      modifiedCount: 3,
    });
  });

  it("Should throw formatted database error when update fails", async ({
    expect,
  }) => {
    vi.mocked(TaskModel.updateMany).mockRejectedValueOnce(
      new Error("Connection lost"),
    );

    await expect(expireTasksService()).rejects.toMatchObject({
      statusCode: 500,
      code: "DATABASE_ERROR",
      message: "It was not possible to expire tasks at this time.",
    });
  });
});
