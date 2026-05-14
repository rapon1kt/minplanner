import { revalidatePath } from "next/cache";
import { createTaskAction } from "@/actions/task";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getVerifiedUser } from "@/lib/verify-auth";
import { createTaskService } from "@/services/task";

vi.mock("@/lib/verify-auth", () => ({
  getVerifiedUser: vi.fn(),
}));

vi.mock("@/services/task", () => ({
  createTaskService: vi.fn(),
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
    title: "valid_title",
    dueDate: new Date(2030, 2, 26).toString(),
    severity: "low",
    description: "valid_description",
  });

const makeTask = () => ({
  title: "valid_title",
  userId: "valid_user_id",
  dueDate: "valid_dueDate",
  severity: "valid_severity",
  description: "valid_description",
});

describe("CreateTaskAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getVerifiedUser).mockResolvedValue({
      id: "valid_user_id",
      name: "valid_user_name",
      email: "valid_user_email",
    });
    vi.mocked(createTaskService).mockResolvedValue(makeTask());
  });

  it("Should return a validation error if no title is provided.", async () => {
    const result = await createTaskAction(null, createMockFormData({}));

    expect(result.success).toBe(false);
    expect(result.errors?.title).toBeDefined();
    expect(result.message).toBe("Invalid fields value.");
    expect(createTaskService).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("Should return a validation error if any field is invalid.", async () => {
    const formData = createMockFormData({
      title: "valid_title",
      description: ".".repeat(301),
      severity: "invalid_severity",
      dueDate: new Date(2007, 3, 26).toDateString(),
    });

    const result = await createTaskAction(null, formData);

    expect(result.success).toBe(false);
    expect(result.errors?.description).toBeDefined();
    expect(result.errors?.severity).toBeDefined();
    expect(result.errors?.dueDate).toBeDefined();
    expect(result.message).toBe("Invalid fields value.");
    expect(createTaskService).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("Should call CreateTaskService with validated data and user id.", async () => {
    const result = await createTaskAction(null, makeValidFormData());

    expect(result.success).toBe(true);
    expect(result.newTask).toEqual(makeTask());
    expect(createTaskService).toHaveBeenCalledWith({
      title: "valid_title",
      userId: "valid_user_id",
      severity: "low",
      dueDate: new Date(2030, 2, 26),
      description: "valid_description",
    });
  });
});
