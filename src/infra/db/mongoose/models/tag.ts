import { Document } from "mongodb";
import { Tag } from "@/core/domain/models/tag";
import { model, models, Schema, Types } from "mongoose";

export interface TagDocument extends Document {
  title: string;
  color: string;
  description?: string;
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const tagSchema = new Schema<Tag>(
  {
    title: {
      type: String,
      trim: true,
      maxLength: [20, "Title cannot have more than 20 characteres."],
      required: true,
    },
    color: {
      type: String,
      trim: true,
      match: [/^#([0-9a-f]{3}){1,2}$/i, "Invalid format of color. Use HEX."],
      required: true,
    },
    description: {
      type: String,
      trim: true,
      maxLength: [100, "Description cannot have more than 100 characteres."],
      required: false,
    },
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  },
  { timestamps: true },
);

tagSchema.index({ userId: 1, title: 1 }, { unique: true });

export const TagModel = models.Tag || model<Tag>("Tag", tagSchema);
