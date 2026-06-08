import { Types } from "mongoose";

export type Tag = {
  _id: Types.ObjectId | string;
  title: string;
  color: string;
  description?: string;

  userId: Types.ObjectId | string;

  createdAt: Date;
  updatedAt: Date;
};
