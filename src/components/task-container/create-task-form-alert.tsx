"use client";
import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import type { CreateTaskFormState } from "./create-task-form-types";

type FieldName = "title" | "description" | "dueDate" | "severity";

const fieldLabels: Record<FieldName, string> = {
  title: "Title",
  description: "Description",
  dueDate: "Due date",
  severity: "Priority",
};

const getFieldErrors = (result: CreateTaskFormState) => {
  if (!result.errors) return [];

  return Object.entries(result.errors).flatMap(([field, value]) =>
    value.errors.map((error) => ({
      field: fieldLabels[field as FieldName] ?? field,
      error,
    })),
  );
};

export default function CreateTaskFormAlert({
  result,
}: {
  result: CreateTaskFormState;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [prevResult, setPrevResult] = useState(result);

  const duration = 8000;

  if (result !== prevResult) {
    setPrevResult(result);
    setIsVisible(!!result.message);
  }

  useEffect(() => {
    if (isVisible && result.message) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, result.message]);

  if (!result.message || !isVisible) return null;

  const fieldErrors = getFieldErrors(result);
  const isSuccess = result.success;

  return (
    <div
      role={isSuccess ? "status" : "alert"}
      className={`relative overflow-hidden rounded-sm border px-3 py-2 font-barlow text-sm shadow-md transition-all duration-300 ${
        isSuccess
          ? "border-green-900/80 bg-green-900/30 text-green-200"
          : "border-red-900/80 bg-red-900/30 text-red-200"
      }`}
    >
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-1">
        {isSuccess ? (
          <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
        ) : (
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
        )}
        <div className="space-y-1">
          <p className="font-sm">{result.message}</p>
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
      </div>
      <div
        key={prevResult === result ? "running" : "reset"}
        className={`absolute bottom-0 left-0 h-0.75 animate-progress-timer ${
          isSuccess ? "bg-green-700/60" : "bg-red-700/60"
        }`}
      />
    </div>
  );
}
