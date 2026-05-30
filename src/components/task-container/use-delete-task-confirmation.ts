"use client";
import { useEffect, useId, useRef, useState } from "react";
import { DELETE_TASK_CONFIRMATION_PREFERENCE_KEY } from "./task-card/task-card-utils";

const getInitialShouldConfirmDelete = () => {
  if (typeof window === "undefined") return true;

  try {
    const storedPreference = window.localStorage.getItem(
      DELETE_TASK_CONFIRMATION_PREFERENCE_KEY,
    );

    return storedPreference === null ? true : storedPreference === "true";
  } catch {
    return true;
  }
};

export default function useDeleteTaskConfirmation() {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [shouldConfirmDelete, setShouldConfirmDelete] = useState<boolean>(
    getInitialShouldConfirmDelete,
  );
  const [dontAskAgain, setDontAskAgain] = useState<boolean>(false);
  const deleteFormRef = useRef<HTMLFormElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const deleteFormId = useId();
  const deleteModalTitleId = useId();

  useEffect(() => {
    if (!isDeleteModalOpen) return;

    cancelButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDontAskAgain(false);
        setIsDeleteModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDeleteModalOpen]);

  function handleChangePreference(state: boolean) {
    setShouldConfirmDelete(state);

    try {
      window.localStorage.setItem(
        DELETE_TASK_CONFIRMATION_PREFERENCE_KEY,
        String(state),
      );
    } catch {}
  }

  function handleDeleteIntent() {
    if (shouldConfirmDelete) {
      setIsDeleteModalOpen(true);
      return;
    }

    deleteFormRef.current?.requestSubmit();
  }

  function handleCloseDeleteModal() {
    setDontAskAgain(false);
    setIsDeleteModalOpen(false);
  }

  function handleConfirmDelete() {
    if (dontAskAgain) {
      handleChangePreference(false);
    }
  }

  return {
    cancelButtonRef,
    deleteFormId,
    deleteFormRef,
    deleteModalTitleId,
    dontAskAgain,
    handleCloseDeleteModal,
    handleConfirmDelete,
    handleDeleteIntent,
    isDeleteModalOpen,
    setDontAskAgain,
  };
}
