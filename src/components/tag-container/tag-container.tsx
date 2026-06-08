"use client";
import { Tags } from "lucide-react";
import type { Tag } from "@/core/domain/models";
import CreateTagForm from "./create-tag-form";
import TagCard from "./tag-card";

export default function TagContainer({ tags }: { tags: Tag[] }) {
  return (
    <section className="animate-fade-in space-y-6 p-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="flex items-center gap-2 font-barlow text-sm uppercase tracking-widest text-red-900">
            <Tags size={16} />
            Tags
          </p>
          <h1 className="mt-1 font-space text-3xl text-neutral-300">
            Organize your tasks by context
          </h1>
        </div>
        <p className="font-barlow text-sm text-neutral-500">
          {tags.length} {tags.length === 1 ? "tag" : "tags"} created
        </p>
      </div>

      <CreateTagForm />

      {tags.length === 0 ? (
        <div className="rounded-sm border border-dashed border-neutral-800 bg-neutral-900/10 p-8 text-center">
          <p className="font-space text-lg text-neutral-400">No tags yet.</p>
          <p className="mt-1 font-barlow text-sm text-neutral-500">
            Create your first tag and start grouping tasks by project, area, or
            priority style.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {tags.map((tag) => (
            <TagCard key={tag._id?.toString()} tag={tag} />
          ))}
        </div>
      )}
    </section>
  );
}
