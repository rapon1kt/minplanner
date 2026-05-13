import { revalidatePath } from "next/cache";
import { createTaskAction } from "@/actions/task";
import { TaskModel } from "@/infra/db/mongoose/models";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/auth", () => ({
  auth: vi.fn().mockResolvedValue({
    user: {
      id: "user_id",
      name: "user_name",
      email: "user@mail.com",
    },
  }),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@/infra/db/mongoose/models", () => ({
  TaskModel: {
    create: vi.fn(),
  },
}));

vi.mock("@/infra/db/mongoose/mongoose", () => ({
  connectMongoose: vi.fn(),
}));

const createMockFormData = (data: Record<string, string>) => {
  return {
    get: (key: string) => data[key] ?? undefined,
  } as unknown as FormData;
};

describe("CreateTaskAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Should return a validation error if no title is provided.", async () => {
    const formData = createMockFormData({});
    const result = await createTaskAction(null, formData);

    expect(result.success).toBe(false);
    expect(result.errors?.title).toBeDefined();
    expect(result.message).toBe("Invalid fields value.");

    expect(TaskModel.create).not.toHaveBeenCalled();
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
});
