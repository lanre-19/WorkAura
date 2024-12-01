import { useRouter } from "next/navigation";
import {
  ExternalLinkIcon,
  FolderOpen,
  PencilIcon,
  TrashIcon,
} from "lucide-react";

import DottedSeparator from "@/components/dotted-separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

import { useConfirm } from "@/hooks/use-confirm";

import { useDeleteTask } from "../api/use-delete-task";
import { useUpdateTaskModal } from "../hooks/use-update-task-modal";

interface TaskActionsProps {
  id: string;
  projectId: string;
  children: React.ReactNode;
}

const TaskActions = ({ id, projectId, children }: TaskActionsProps) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  
  const { open } = useUpdateTaskModal();
  const [ConfimDialog, confirm] = useConfirm(
    "Delete Task",
    "Are you sure? This task will be deleted permanently.",
    "destructive"
  );

  const { mutate, isPending } = useDeleteTask();

  const onDelete = async () => {
    const ok = await confirm();

    if (!ok) return;

    mutate({ param: { taskId: id } });
  };

  const onOpenTask = () => {
    router.push(`/workspaces/${workspaceId}/tasks/${id}`);
  };

  const onOpenProject = () => {
    router.push(`/workspaces/${workspaceId}/projects/${projectId}`);
  };

  return (
    <div
      className="flex justify-end"
    >
      <ConfimDialog />
      <DropdownMenu
        modal={false}
      >
        <DropdownMenuTrigger
          asChild
        >
          {children}
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-48"
          align="end"
        >
          <DropdownMenuItem
            onClick={onOpenTask}
            className="font-medium p-[10px]"
          >
            <ExternalLinkIcon
              className="size-4 mr-2 stroke-2"
            />
            Task Details
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onOpenProject}
            className="font-medium p-[10px]"
          >
            <FolderOpen
              className="size-4 mr-2 stroke-2"
            />
            Open Project
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => open(id)}
            className="font-medium p-[10px]"
          >
            <PencilIcon
              className="size-4 mr-2 stroke-2"
            />
            Edit Task
          </DropdownMenuItem>
          
          <DottedSeparator />

          <DropdownMenuItem
            onClick={onDelete}
            className="text-amber-700 focus:text-amber-700 font-medium p-[10px]"
            disabled={isPending}
          >
            <TrashIcon
              className="size-4 mr-2 stroke-2"
            />
            Delete Task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default TaskActions;
