import mongoose, { Document } from "mongoose";
import { model, Schema, Types } from "mongoose";

export interface TaskDocument extends Document {
  title: string;
  dueDate?: Date;
  severity?: string;
  isCompleted: boolean;
  description?: string;

  tags?: Types.ObjectId[];
  userId: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<TaskDocument>(
  {
    title: {
      trim: true,
      type: String,
      unique: true,
      required: true,
      minLength: [3, "Title must be at least 3 characters."],
      maxLength: [50, "Title cannot be more than 50 characters."],
    },
    dueDate: {
      type: Date,
      required: false,
    },
    isCompleted: {
      type: Boolean,
      default: false,
      required: true,
    },
    severity: {
      trim: true,
      type: String,
      enum: ["low", "medium", "high"],
      required: false,
    },
    description: {
      trim: true,
      type: String,
      required: false,
      maxLength: [300, "Description cannot be more than 300 characters."],
    },
    tags: {
      ref: "Tag",
      type: [Schema.Types.ObjectId],
      required: false,
    },
    userId: {
      ref: "User",
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true },
);

export const TaskModel =
  mongoose.models.Task || model<TaskDocument>("Task", taskSchema);
