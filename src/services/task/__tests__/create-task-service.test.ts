import { TaskModel } from "@/infra/db/mongoose/models";
import { connectMongoose } from "@/infra/db/mongoose/mongoose";
import { createTaskService } from "@/services/task";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";

vi.mock("@/infra/db/mongoose/mongoose", () => ({
  connectMongoose: vi.fn(),
}));

vi.mock("@/infra/db/mongoose/models", () => ({
  TaskModel: {
    create: vi.fn(),
  },
}));

const makeCreateTaskDTO = () => ({
  title: "valid_title",
  userId: "valid_user_id",
  dueDate: new Date(2030, 2, 26),
  severity: "low",
  description: "valid_description",
});

const makeTask = () => ({
  ...makeCreateTaskDTO(),
  isCompleted: false,
});

describe("CreateTaskService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(TaskModel.create as Mock).mockResolvedValue(makeTask());
  });

  it("Should connect to mongoose before creating a task.", async () => {
    await createTaskService(makeCreateTaskDTO());

    expect(connectMongoose).toHaveBeenCalledOnce();
  });
});
