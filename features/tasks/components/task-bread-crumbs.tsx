import Link from "next/link";
import { ChevronRightIcon, TrashIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import ProjectsAvatar from "@/features/projects/components/projects-avatar";
import { Project } from "@/features/projects/types";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

import { Task } from "../types";
import { useDeleteTask } from "../api/use-delete-task";
import { useConfirm } from "@/hooks/use-confirm";
import { useRouter } from "next/navigation";

interface TaskBreadCrumbsProps {
    project: Project;
    task: Task;
}

const TaskBreadCrumbs = ({
    project,
    task
}: TaskBreadCrumbsProps) => {
    const workspaceId = useWorkspaceId();
    const router = useRouter();

    const { mutate, isPending } = useDeleteTask();

    const [ConfimDialog, confirm] = useConfirm(
        "Delete Task",
        "Are you sure? This task will be deleted permanently.",
        "destructive"
    );

    const handleDelete = async () => {
        const ok = await confirm();

        if (!ok) return;

        mutate({
            param: {
                taskId: task.$id
            }
        }, {
            onSuccess: () => {
                router.push(`/workspaces/${workspaceId}/tasks`);
            }
        });
    };

    return (
        <div
          className="flex items-center gap-x-2"
        >
            <ConfimDialog />
            <ProjectsAvatar
              className="size-5 lg:size-7"
              name={project.name}
              image={project.imageUrl}
            />

            <Link
              href={`/workspaces/${workspaceId}/projects/${project.$id}`}
            >
                <p
                  className="text-sm lg:text-base font-semibold text-muted-foreground hover:opacity-75 transition"
                >
                    {project.name}
                </p>
            </Link>
            
            <ChevronRightIcon
              className="size-3 lg:size-4 text-muted-foreground"
            />

            <p
              className="text-sm lg:text-base font-semibold"
            >
                {task.name}
            </p>

            <Button
              onClick={handleDelete}
              className="ml-auto"
              size="sm"
              variant="destructive"
              disabled={isPending}
            >
                <TrashIcon
                  className="size-4 lg:mr-2"
                />
                <span
                  className="hidden lg:block"
                >
                    Delete task
                </span>
            </Button>
        </div>
    );
}
 
export default TaskBreadCrumbs;