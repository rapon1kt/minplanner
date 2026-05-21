import { beforeEach, describe, it, vi } from "vitest";
import updateTaskService from "../update-task-service";

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

describe("UpdateTaskService", () => {
  const mockedUserId = "valid_user_id";
  const mockedTaskId = "507f1f77bcf86cd799439011";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Should update a task with success", async ({ expect }) => {
    mockLean.mockResolvedValueOnce({
      _id: mockedTaskId,
      title: "Title",
      userId: mockedUserId,
      description: "Description",
      dueDate: new Date(2030, 3, 26),
      severity: "low",
    });

    const result = await updateTaskService(
      mockedTaskId,
      mockedUserId,
      makeUpdateTaskDTO(),
    );
    expect(result.success).toBe(true);
    expect(result.updatedTask).toBeDefined();
  });
});
