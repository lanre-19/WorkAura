import { useRouter } from "next/navigation";

import ProjectsAvatar from "@/features/projects/components/projects-avatar";
import MemberAvatar from "@/features/members/components/member-avatar";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { Project } from "@/features/projects/types";

import { cn } from "@/lib/utils";

import { TaskStatus } from "../types";

interface EventCardProps {
    id: string;
    assignee: any;
    title: string;
    project: Project;
    status: TaskStatus;
}

const statusColorMap: Record<TaskStatus, string> = {
    [TaskStatus.BACKLOG]: "border-l-pink-500",
    [TaskStatus.TODO]: "border-l-red-500",
    [TaskStatus.IN_PROGRESS]: "border-l-yellow-500",
    [TaskStatus.IN_REVIEW]: "border-l-blue-500",
    [TaskStatus.DONE]: "border-l-emerald-500",
};

const EventCard = ({
    id,
    assignee,
    title,
    project,
    status
}: EventCardProps) => {
    const workspaceId = useWorkspaceId();
    const router = useRouter();

    const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();

        router.push(`/workspaces/${workspaceId}/tasks/${id}`);
    };

    return (
        <div
          className="px-2 py-1"
        >
            <div
              onClick={onClick}
              className={cn(
                "flex flex-col text-xs text-primary bg-white p-1.5 border rounded-md border-l-4 gap-y-1.5 cursor-pointer hover:opacity-75 transition",
                statusColorMap[status]
              )}
            >
                <p>
                    {title}
                </p>
                <div
                  className="flex items-center gap-x-1"
                >
                    <MemberAvatar
                      name={assignee?.name}
                    />
                    <div
                      className="size-1 rounded-full bg-neutral-300"
                    />
                    <ProjectsAvatar
                      name={project?.name}
                      image={project?.imageUrl}
                    />
                </div>
            </div>
        </div>
    );
}
 
export default EventCard;