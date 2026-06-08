import { TaskModel } from "../models";
import { connectMongoose } from "../mongoose";

export const TaskRepository = {
  async getTasksByUserId(userId: string) {
    await connectMongoose();
    return TaskModel.find({ userId }).lean();
  },
};
