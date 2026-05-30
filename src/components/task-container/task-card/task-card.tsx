"use client";
import {
  TaskDesktopDeleteButton,
  TaskDesktopStatusAction,
  TaskMobileActions,
} from "./task-card-actions";
import type { Task } from "@/core/domain/models";
import TaskCardContent from "./task-card-content";
import { deleteTask } from "@/actions/task/form-actions";
import useDeleteTaskConfirmation from "../use-delete-task-confirmation";
import DeleteTaskConfirmationModal from "../delete-task-confirmation-modal";

export default function TaskCard({ task }: { task: Task }) {
  const {
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
  } = useDeleteTaskConfirmation();

  return (
    <div className="group flex w-full flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-neutral-900/20 rounded-sm border border-neutral-800 hover:border-neutral-700 transition-all hover:bg-neutral-900/50">
      <form
        id={deleteFormId}
        ref={deleteFormRef}
        className="hidden"
        action={deleteTask}
      >
        <input type="hidden" name="taskId" value={task._id?.toString()} />
      </form>

      <TaskDesktopStatusAction task={task} />
      <TaskCardContent task={task} />
      <TaskDesktopDeleteButton onDeleteIntentAction={handleDeleteIntent} />
      <TaskMobileActions
        task={task}
        onDeleteIntentAction={handleDeleteIntent}
      />

      {isDeleteModalOpen && (
        <DeleteTaskConfirmationModal
          cancelButtonRef={cancelButtonRef}
          dontAskAgain={dontAskAgain}
          formId={deleteFormId}
          onCancelAction={handleCloseDeleteModal}
          onConfirmAction={handleConfirmDelete}
          onDontAskAgainChangeAction={setDontAskAgain}
          taskTitle={task.title}
          titleId={deleteModalTitleId}
        />
      )}
    </div>
  );
}
