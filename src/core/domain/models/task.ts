import { Types } from "mongoose";

export type Task = {
  _id: Types.ObjectId | undefined;
  title: string;
  dueDate?: string;
  severity?: string;
  isExpired: boolean;
  isCompleted: boolean;
  description: string;

  tags?: Types.ObjectId[];
  userId: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
};
