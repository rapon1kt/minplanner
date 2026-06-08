"use client";
import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, X } from "lucide-react";
import type { TagFormState } from "./tag-form-types";

type FieldName = "tagId" | "title" | "color" | "description";

const fieldLabels: Record<FieldName, string> = {
  tagId: "Tag",
  title: "Title",
  color: "Color",
  description: "Description",
};

const getFieldErrors = (result: TagFormState) => {
  if (!result.errors) return [];

  return Object.entries(result.errors).flatMap(([field, value]) =>
    value.errors.map((error) => ({
      field: fieldLabels[field as FieldName] ?? field,
      error,
    })),
  );
};

export default function TagFormAlert({ result }: { result: TagFormState }) {
  const [dismissedMessageKey, setDismissedMessageKey] = useState<string | null>(
    null,
  );
  const messageKey = `${result.success}-${result.errorCode ?? ""}-${result.message}`;
  const isVisible =
    Boolean(result.message) && dismissedMessageKey !== messageKey;

  useEffect(() => {
    if (!isVisible || !result.message) return;

    const timer = setTimeout(() => {
      setDismissedMessageKey(messageKey);
    }, 8000);

    return () => clearTimeout(timer);
  }, [isVisible, messageKey, result.message]);

  if (!result.message || !isVisible) return null;

  const fieldErrors = getFieldErrors(result);
  const isSuccess = result.success;

  return (
    <div
      role={isSuccess ? "status" : "alert"}
      className={`relative overflow-hidden animate-fade-in rounded-sm border px-3 py-2 font-barlow text-sm shadow-md ${
        isSuccess
          ? "border-green-900/80 bg-green-900/30 text-green-200"
          : "border-red-900/80 bg-red-900/30 text-red-200"
      }`}
    >
      <div className="flex items-start gap-3">
        {isSuccess ? (
          <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
        ) : (
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
        )}
        <div className="space-y-1 flex-1">
          <p>{result.message}</p>
          {fieldErrors.length > 0 && (
            <ul className="list-disc space-y-1 pl-4">
              {fieldErrors.map(({ field, error }) => (
                <li key={`${field}-${error}`}>
                  <span className="font-medium">{field}:</span> {error}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          type="button"
          aria-label="Dismiss tag message"
          onClick={() => setDismissedMessageKey(messageKey)}
          className="mt-0.5 cursor-pointer"
        >
          <X size={18} />
        </button>
      </div>
      <div
        className={`absolute bottom-0 left-0 h-0.75 animate-progress-timer ${
          isSuccess ? "bg-green-700/60" : "bg-red-700/60"
        }`}
      />
    </div>
  );
}
