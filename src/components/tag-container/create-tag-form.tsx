"use client";
import { Plus } from "lucide-react";
import { useActionState, useState } from "react";
import createTagAction from "@/actions/tag/create-tag-action";
import TagFormAlert from "./tag-form-alert";
import { initialTagFormState } from "./tag-form-types";

const suggestedColors = ["#991b1b", "#92400e", "#166534", "#1d4ed8", "#6d28d9"];

export default function CreateTagForm() {
  const [state, formAction, pending] = useActionState(
    createTagAction,
    initialTagFormState,
  );

  const [formColor, setFormColor] = useState<string>("#991b1b");

  return (
    <div className="space-y-4 rounded-sm border border-neutral-800 bg-neutral-900/20 p-4">
      <div>
        <h2 className="font-space text-xl text-neutral-300">Create tag</h2>
        <p className="font-barlow text-sm text-neutral-500">
          Use tags to group tasks by context, project, energy, or anything your
          workflow needs.
        </p>
      </div>

      <TagFormAlert result={state} />

      <form action={formAction} className="grid gap-3 lg:grid-cols-12">
        <div className="flex flex-col gap-1 lg:col-span-3">
          <label
            className="text-neutral-400 font-space text-xs"
            htmlFor="title"
          >
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            maxLength={20}
            placeholder="Work"
            className="font-barlow py-2 bg-neutral-900 border border-neutral-800 rounded-sm px-2 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:bg-neutral-800 focus:border-red-900 transition-all"
          />
        </div>

        <div className="flex flex-col gap-1 lg:col-span-2">
          <label
            className="text-neutral-400 font-space text-xs"
            htmlFor="color"
          >
            Color
          </label>
          <div className="flex items-center gap-2 rounded-sm border border-neutral-800 bg-neutral-900 px-2 py-1.5">
            <input
              id="color"
              name="color"
              type="color"
              onChange={(e) => setFormColor(e.target.value)}
              value={formColor}
              aria-label="Tag color"
              className="h-7 w-8 cursor-pointer bg-transparent"
            />
            <div className="hidden gap-1 sm:flex">
              {suggestedColors.map((color) => (
                <span
                  key={color}
                  onClick={() => setFormColor(color)}
                  title={color}
                  className="cursor-pointer size-3 rounded-full border border-neutral-700"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1 lg:col-span-6">
          <label
            className="text-neutral-400 font-space text-xs"
            htmlFor="description"
          >
            Description
          </label>
          <input
            id="description"
            name="description"
            type="text"
            maxLength={100}
            placeholder="Short note about when to use this tag"
            className="font-barlow py-2 bg-neutral-900 border border-neutral-800 rounded-sm px-2 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:bg-neutral-800 focus:border-red-900 transition-all"
          />
        </div>

        <button
          disabled={pending}
          type="submit"
          className="mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-sm bg-red-900/70 px-3 py-2 font-barlow text-sm text-white transition-colors hover:bg-red-800/50 disabled:cursor-not-allowed disabled:opacity-60 lg:col-span-1 lg:mt-5"
        >
          <Plus size={18} />
          <span className="lg:hidden">Create</span>
        </button>
      </form>
    </div>
  );
}
