import { Types } from "mongoose";

export type Task = {
  _id: Types.ObjectId | undefined;
  title: string;
  dueDate?: Date;
  severity?: string;
  isCompleted: boolean;
  description?: string;

  tags?: Types.ObjectId[];
  userId: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
};
