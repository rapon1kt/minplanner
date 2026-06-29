"use client";
import type { RefObject } from "react";
import { OctagonX, Trash2 } from "lucide-react";

type DeleteTaskConfirmationModalProps = {
  cancelButtonRef: RefObject<HTMLButtonElement | null>;
  dontAskAgain: boolean;
  formId: string;
  onCancelAction: () => void;
  onConfirmAction: () => void;
  onDontAskAgainChangeAction: (value: boolean) => void;
  taskTitle: string;
  titleId: string;
};

export default function DeleteTaskConfirmationModal({
  cancelButtonRef,
  dontAskAgain,
  formId,
  onCancelAction,
  onConfirmAction,
  onDontAskAgainChangeAction,
  taskTitle,
  titleId,
}: DeleteTaskConfirmationModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-md rounded-sm border border-neutral-800 bg-neutral-950 p-5 shadow-2xl shadow-black/40"
      >
        <div className="mb-4 flex items-start gap-3">
          <div className="min-w-0">
            <h2 id={titleId} className="font-space text-lg text-neutral-200">
              Delete task?
            </h2>
            <p className="mt-1 max-w-full wrap-anywhere font-barlow text-sm text-neutral-500">
              This will permanently delete{" "}
              <span className="text-neutral-300">{taskTitle}</span>.
            </p>
          </div>
        </div>

        <label className="mb-5 flex cursor-pointer items-center gap-3 rounded-sm border border-neutral-800 bg-neutral-900/50 p-3 font-barlow text-sm text-neutral-400">
          <input
            type="checkbox"
            checked={dontAskAgain}
            onChange={(event) =>
              onDontAskAgainChangeAction(event.target.checked)
            }
            className="h-4 w-4 cursor-pointer accent-red-900"
          />
          Don&apos;t ask again after this delete
        </label>

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={onCancelAction}
            className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-sm border border-neutral-800 bg-neutral-900 px-4 py-2 font-barlow text-sm text-neutral-400 transition-colors hover:border-neutral-700 hover:text-neutral-200"
          >
            <OctagonX size={14} />
            Cancel
          </button>
          <button
            type="submit"
            form={formId}
            onClick={onConfirmAction}
            className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-sm border border-red-800/70 bg-red-900/10 px-4 py-2 font-barlow text-sm text-red-300 transition-colors hover:bg-red-900/20"
          >
            <Trash2 size={14} />
            Delete task
          </button>
        </div>
      </div>
    </div>
  );
}
