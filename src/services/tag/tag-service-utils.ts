import { AppError } from "@/errors/app-error";
import { TagModel } from "@/infra/db/mongoose/models";

export function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function ensureTagTitleIsAvailable(
  title: string,
  userId: string,
  ignoredTagId?: string,
) {
  const existingTag = await TagModel.exists({
    userId,
    title: new RegExp(`^${escapeRegExp(title)}$`, "i"),
    ...(ignoredTagId ? { _id: { $ne: ignoredTagId } } : {}),
  });

  if (existingTag) {
    throw new AppError(
      "You already have a tag with this title.",
      409,
      "TAG_ALREADY_EXISTS",
    );
  }
}

export function getUniqueTagIds(tagIds: string[] | undefined) {
  if (!tagIds) return [];
  return [...new Set(tagIds.filter(Boolean))];
}

export async function ensureTagsBelongToUser(
  tagIds: string[] | undefined,
  userId: string,
) {
  const uniqueTagIds = getUniqueTagIds(tagIds);

  if (uniqueTagIds.length === 0) return uniqueTagIds;

  const ownedTagsCount = await TagModel.countDocuments({
    _id: { $in: uniqueTagIds },
    userId,
  });

  if (ownedTagsCount !== uniqueTagIds.length) {
    throw new AppError(
      "One or more selected tags are invalid.",
      400,
      "INVALID_TAGS",
    );
  }

  return uniqueTagIds;
}
