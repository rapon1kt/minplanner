import { revalidatePath } from "next/cache";
import { createTaskAction } from "@/actions/task";
import { TaskModel } from "@/infra/db/mongoose/models";
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
    dueDate: "valid_dueDate",
    severity: "valid_severity",
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

  it("Should return a validation error if the title is empty.", async () => {
    const formData = createMockFormData({
      title: "",
    });

    const result = await createTaskAction(null, formData);

    expect(result.success).toBe(false);
    expect(result.errors?.title).toBeDefined();
    expect(result.message).toBe("Invalid fields value.");

    expect(TaskModel.create).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("Should return a validation error if the title length is less than 3 characteres.", async () => {
    const formData = createMockFormData({
      title: "12",
    });
    const result = await createTaskAction(null, formData);

    expect(result.success).toBe(false);
    expect(result.errors?.title).toBeDefined();
    expect(result.message).toBe("Invalid fields value.");

    expect(TaskModel.create).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("Should return a validation error if the title length is more than 50 characters.", async () => {
    const formData = createMockFormData({
      title: ".".repeat(51),
    });

    const result = await createTaskAction(null, formData);

    expect(result.success).toBe(false);
    expect(result.errors?.title).toBeDefined();
    expect(result.message).toBe("Invalid fields value.");

    expect(TaskModel.create).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("Should return a validation error if the description length is more than 300 characters", async () => {
    const formData = createMockFormData({
      title: "123",
      description: ".".repeat(301),
    });

    const result = await createTaskAction(null, formData);

    expect(result.success).toBe(false);
    expect(result.errors?.title).not.toBeDefined();
    expect(result.errors?.description).toBeDefined();

    expect(result.message).toBe("Invalid fields value.");

    expect(TaskModel.create).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("Should return a validation error if the severity is invalid.", async () => {
    const formData = createMockFormData({
      title: "123",
      description: "123",
      severity: "invalid_severity",
    });

    const result = await createTaskAction(null, formData);

    expect(result.success).toBe(false);
    expect(result.errors?.title).not.toBeDefined();
    expect(result.errors?.description).not.toBeDefined();
    expect(result.errors?.severity).toBeDefined();

    expect(result.message).toBe("Invalid fields value.");

    expect(TaskModel.create).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("Should return a validation error if dueDate is before the current day", async () => {
    const formData = createMockFormData({
      title: "123",
      description: "123",
      severity: "low",
      dueDate: new Date(2007, 3, 26).toDateString(),
    });

    const result = await createTaskAction(null, formData);

    expect(result.success).toBe(false);
    expect(result.errors?.title).not.toBeDefined();
    expect(result.errors?.description).not.toBeDefined();
    expect(result.errors?.severity).not.toBeDefined();
    expect(result.errors?.dueDate).toBeDefined();

    expect(TaskModel.create).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });
});
