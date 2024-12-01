"use client";

import ResponsiveModal from "@/components/responsive-modal";
import UpdateTaskFormWrapper from "./update-task-form-wrapper";

import { useUpdateTaskModal } from "../hooks/use-update-task-modal";

const UpdateTaskModal = () => {
  const { taskId, close } = useUpdateTaskModal();

  return (
    <ResponsiveModal
      open={!!taskId}
      onOpenChange={close}
    >
      {taskId && (
        <UpdateTaskFormWrapper
          onCancel={close}
          id={taskId}
        />
      )}
    </ResponsiveModal>
  );
};

export default UpdateTaskModal;
