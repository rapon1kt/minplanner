import updateTaskAction from "@/actions/task/update-task-action";
import { getVerifiedUser } from "@/lib/verify-auth";
import { revalidatePath } from "next/cache";
import { beforeEach, describe, it, vi } from "vitest";

vi.mock("@/lib/verify-auth", () => ({
  getVerifiedUser: vi.fn(),
}));

vi.mock("@/services/task", () => ({
  updateTaskService: vi.fn(),
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
    taskId: "507f1f77bcf86cd799439011",
    title: "new_valid_title",
    dueDate: new Date(2067, 3, 2026).toString(),
    severity: "high",
    description: "new_valid_description",
  });

describe("UpdateTaskAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getVerifiedUser).mockResolvedValue({
      id: "valid_user_id",
      name: "valid_user_name",
      email: "valid_user_email",
    });
  });

  it("Should update a task with success", async ({ expect }) => {
    const result = await updateTaskAction(null, makeValidFormData());

    expect(revalidatePath).toHaveBeenCalledExactlyOnceWith("/");

    expect(result.errors).not.toBeDefined();
    expect(result.errorCode).not.toBeDefined();
    expect(result).toEqual({
      success: true,
      message: "Task updated with success.",
    });
  });

  it("Should return a validation error if no taskId is provided", async ({
    expect,
  }) => {
    const result = await updateTaskAction(null, createMockFormData({}));
    expect(result.success).toBe(false);
    expect(result.errors?.taskId).toBeDefined();
    expect(result.message).toBe("Invalid fields.");
  });
});
