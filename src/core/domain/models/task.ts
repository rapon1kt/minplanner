import { Types } from "mongoose";

export type Task = {
  _id: Types.ObjectId | undefined;
  title: string;
  dueDate?: string;
  severity?: string;
  isExpired: boolean;
  isCompleted: boolean;
  description: string;

  tags?: Array<Types.ObjectId | string>;
  userId: Types.ObjectId | string;

  createdAt: Date;
  updatedAt: Date;
};
