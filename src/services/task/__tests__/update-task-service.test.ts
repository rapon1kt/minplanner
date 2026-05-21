import { beforeEach, describe, it, vi } from "vitest";
import updateTaskService from "../update-task-service";
import { connectMongoose } from "@/infra/db/mongoose/mongoose";
import { TaskModel } from "@/infra/db/mongoose/models";
import { AppError } from "@/errors/app-error";

vi.mock("@/infra/db/mongoose/mongoose", () => ({
  connectMongoose: vi.fn(),
}));

const mockLean = vi.fn();
vi.mock("@/infra/db/mongoose/models", () => ({
  TaskModel: {
    findOneAndUpdate: vi.fn(() => ({
      lean: mockLean,
    })),
  },
}));

const makeUpdateTaskDTO = () => ({
  title: "Title",
  description: "Description",
  dueDate: new Date(2030, 3, 26),
  severity: "low",
});

const makeValidUpdatedTask = () => ({
  _id: "507f1f77bcf86cd799439011",
  title: "New Title",
  userId: "valid_user_id",
  description: "New Description",
  dueDate: new Date(2067, 3, 26),
  severity: "high",
});

describe("UpdateTaskService", () => {
  const mockedUserId = "valid_user_id";
  const mockedTaskId = "507f1f77bcf86cd799439011";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Should update a task with success", async ({ expect }) => {
    mockLean.mockResolvedValueOnce(makeValidUpdatedTask());

    const result = await updateTaskService(
      mockedTaskId,
      mockedUserId,
      makeUpdateTaskDTO(),
    );

    expect(connectMongoose).toHaveBeenCalledOnce();
    expect(TaskModel.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: mockedTaskId, userId: mockedUserId },
      { $set: makeUpdateTaskDTO() },
      { new: true },
    );
    expect(mockLean).toHaveBeenCalledOnce();
    expect(result).toEqual({
      success: true,
      updatedTask: makeValidUpdatedTask(),
    });
  });

  it("Should return the same task if no property to update is provided", async ({
    expect,
  }) => {
    mockLean.mockResolvedValueOnce({
      _id: "507f1f77bcf86cd799439011",
      ...makeUpdateTaskDTO(),
    });

    const result = await updateTaskService(mockedTaskId, mockedUserId, {});

    expect(connectMongoose).toHaveBeenCalledOnce();
    expect(TaskModel.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: mockedTaskId, userId: mockedUserId },
      { $set: {} },
      { new: true },
    );
    expect(mockLean).toHaveBeenCalledOnce();
    expect(result).toEqual({
      success: true,
      updatedTask: {
        _id: "507f1f77bcf86cd799439011",
        ...makeUpdateTaskDTO(),
      },
    });
  });

  it("It should throw a task not found error if the task does not exist or belongs to someone else.", async ({
    expect,
  }) => {
    mockLean.mockResolvedValueOnce(null);

    await expect(
      updateTaskService(mockedTaskId, mockedUserId, makeUpdateTaskDTO()),
    ).rejects.toMatchObject({
      code: "NOT_FOUND",
      statusCode: 404,
    });
  });

  it("Should throw native exception if is instance of AppError", async ({
    expect,
  }) => {
    const customError = new AppError(
      "Forced validation error",
      400,
      "VALIDATION_ERROR",
    );
    mockLean.mockRejectedValueOnce(customError);

    await expect(
      updateTaskService(mockedTaskId, mockedUserId, makeUpdateTaskDTO()),
    ).rejects.toThrow(customError);
  });

  it("Should throw generic errors as formatted AppError", async ({
    expect,
  }) => {
    const genericError = new Error("Connection lost");
    mockLean.mockRejectedValueOnce(genericError);

    await expect(
      updateTaskService(mockedTaskId, mockedUserId, makeUpdateTaskDTO()),
    ).rejects.toMatchObject({
      statusCode: 500,
      code: "DATABASE_ERROR",
      message: "It was not possible to update the task at this time.",
    });
  });
});
