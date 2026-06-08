"use server";
import createTagAction from "./create-tag-action";
import deleteTagAction from "./delete-tag-action";
import updateTagAction from "./update-tag-action";

export async function createTag(formData: FormData): Promise<void> {
  "use server";
  await createTagAction(null, formData);
}

export async function deleteTag(formData: FormData): Promise<void> {
  "use server";
  await deleteTagAction(null, formData);
}

export async function updateTag(formData: FormData): Promise<void> {
  "use server";
  await updateTagAction(null, formData);
}
