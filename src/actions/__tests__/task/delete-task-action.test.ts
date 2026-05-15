import { deleteTaskAction } from "@/actions/task";
import { AppError } from "@/errors/app-error";
import { getVerifiedUser } from "@/lib/verify-auth";
import { deleteTaskService } from "@/services/task";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/verify-auth", () => ({
  getVerifiedUser: vi.fn(),
}));

vi.mock("@/services/task", () => ({
  deleteTaskService: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

const createMockFormData = (data: Record<string, string>) => {
  return {
    get: (key: string) => data[key] ?? undefined,
  } as unknown as FormData;
};

describe("DeleteTaskAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getVerifiedUser).mockResolvedValue({
      id: "valid_user_id",
      name: "valid_user_name",
      email: "valid_user_email",
    });
    vi.mocked(deleteTaskService).mockResolvedValue({
      success: true,
    });
  });

  it("Should delete a task with success", async () => {
    const result = await deleteTaskAction(
      null,
      createMockFormData({
        taskId: "507f1f77bcf86cd799439011",
        userId: "valid_user_id",
      }),
    );
    expect(result.success).toBe(true);
    expect(result.errors).not.toBeDefined();
    expect(result.errorCode).not.toBeDefined();
    expect(result.message).toBe("Task deleted with success!");
  });

  it("Should return a validation error if no taskId is provided", async () => {
    const result = await deleteTaskAction(null, createMockFormData({}));
    expect(result.success).toBe(false);
    expect(result.errors?.taskId).toBeDefined();
    expect(result.message).toBe("Invalid TaskId.");
  });

  it("Should return a validation error if taskId is invalid", async () => {
    const result = await deleteTaskAction(
      null,
      createMockFormData({
        taskId: "507f1f77zcf86cd799439011",
      }),
    );
    expect(result.success).toBe(false);
    expect(result.errors?.taskId).toBeDefined();
    expect(result.message).toBe("Invalid TaskId.");
  });

  it("Should throw AppError if deleteTaskService throws", async () => {
    vi.mocked(deleteTaskService).mockRejectedValueOnce(
      new AppError(
        "It was not possible to delete the task at this time.",
        500,
        "DATABASE_ERROR",
      ),
    );

    const result = await deleteTaskAction(
      null,
      createMockFormData({
        taskId: "507f1f77fcf86cd799439011",
        userId: "valid_user_id",
      }),
    );

    expect(result).toEqual({
      success: false,
      errorCode: "DATABASE_ERROR",
      message: "It was not possible to delete the task at this time.",
    });
  });
});
