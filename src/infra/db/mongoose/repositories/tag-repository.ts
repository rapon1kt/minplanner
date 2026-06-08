import { TagModel } from "../models";
import { connectMongoose } from "../mongoose";

export const TagRepository = {
  async getTagsByUserId(userId: string) {
    await connectMongoose();
    return TagModel.find({ userId }).lean();
  },
};
