import { Types } from "mongoose";

export type Tag = {
  _id: Types.ObjectId;
  title: string;
  color: string;
  description?: string;

  userId: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
};
