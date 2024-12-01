"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
    PlusIcon,
    SettingsIcon,
    CalendarIcon
} from "lucide-react";

import Analytics from "@/components/analytics";
import PageLoader from "@/components/page-loader";
import PageError from "@/components/page-error";
import DottedSeparator from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import MemberAvatar from "@/features/members/components/member-avatar";
import ProjectsAvatar from "@/features/projects/components/projects-avatar";
import { Task } from "@/features/tasks/types";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useGetTasks } from "@/features/tasks/api/use-get-tasks";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useGetWorkspaceAnalytics } from "@/features/workspaces/api/use-get-workspace-analytics";
import { useCreateTaskModal } from "@/features/tasks/hooks/use-create-task-modal";
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal";
import { Project } from "@/features/projects/types";
import { Member } from "@/features/members/types";


const WorkspaceIdClientPage = () => {
    const workspaceId = useWorkspaceId();

    const { data: workspaceAnalytics, isLoading: isLoadingWorkspaceAnalytics } = useGetWorkspaceAnalytics({ workspaceId });
    const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({ workspaceId });
    const { data: members, isLoading: isLoadingMembers } = useGetMembers({ workspaceId });
    const { data: projects, isLoading: isLoadingProjects } = useGetProjects({ workspaceId });

    const isLoading = isLoadingWorkspaceAnalytics || isLoadingTasks || isLoadingMembers || isLoadingProjects;

    if (isLoading) {
        return (
            <PageLoader />
        )
    }

    if (!workspaceAnalytics || !tasks || !members || !projects) {
        return (
            <PageError
              message="Failed to load workspace"
            />
        )
    }

    return (
        <div
          className="flex flex-col h-full space-y-4"
        >
            <Analytics
              data={workspaceAnalytics}
            />

            <div
              className="grid grid-cols-1 xl:grid-cols-2 gap-4"
            >
                <TaskList
                  data={tasks.documents}
                  total={tasks.total}
                />
                <ProjectList
                  data={projects.documents}
                  total={projects.total}
                />
                <MemberList
                  data={members.documents}
                  total={members.total}
                />
            </div>
        </div>
    );
}
 
export default WorkspaceIdClientPage;

interface TaskListProps {
    data: Task[];
    total: number;
}

export const TaskList = ({
    data,
    total
}: TaskListProps) => {
    const workspaceId = useWorkspaceId();

    const { open: createTask } = useCreateTaskModal();

    return (
        <div
          className="flex flex-col gap-y-4 col-span-1"
        >
            <div
              className="bg-muted rounded-lg p-4"
            >
                <div
                  className="flex items-center justify-between"
                >
                    <p
                      className="text-lg font-semibold"
                    >
                        Tasks ({total})
                    </p>

                    <Button
                      onClick={createTask}
                      size="icon"
                      variant="muted"
                    >
                        <PlusIcon
                          className="size-4 text-neutral-500"
                        />
                    </Button>
                </div>

                <DottedSeparator
                  className="my-4"
                />

                <ul
                  className="flex flex-col gap-y-4"
                >
                    {data.map((task) => (
                        <li
                          key={task.$id}
                        >
                            <Link
                              href={`/workspaces/${workspaceId}/tasks/${task.$id}`}
                            >
                                <Card
                                  className="rounded-lg hover:opacity-75 shadow-none transition"
                                >
                                    <CardContent
                                      className="p-4"
                                    >
                                        <p
                                          className="text-base font-medium truncate"
                                        >
                                            {task.name}
                                        </p>
                                        <div
                                          className="flex items-center gap-x-2"
                                        >
                                            <p
                                              className="text-sm"
                                            >
                                                {task?.project?.name}
                                            </p>

                                            <div
                                              className="size-1 rounded-full bg-neutral-300"
                                            />

                                            <div
                                              className="flex items-center text-xs text-muted-foreground"
                                            >
                                                <CalendarIcon
                                                  className="size-3 mr-2"
                                                />
                                                <span
                                                  className="truncate"
                                                >
                                                    {formatDistanceToNow(new Date(task.dueDate))}
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        </li>
                    ))}
                    <li
                      className="text-sm text-muted-foreground text-center hidden first-of-type:block"
                    >
                        No tasks found.
                    </li>
                </ul>

                <Button
                  className="mt-4 w-full"
                  variant="muted"
                  asChild
                >
                    <Link
                      href={`/workspaces/${workspaceId}/tasks`}
                    >
                      Show All
                    </Link>
                </Button>
            </div>
        </div>
    )
};

interface ProjectListProps {
    data: Project[];
    total: number;
}

export const ProjectList = ({
    data,
    total
}: ProjectListProps) => {
    const workspaceId = useWorkspaceId();

    const { open: createProject } = useCreateProjectModal();

    return (
        <div
          className="flex flex-col gap-y-4 col-span-1"
        >
            <div
              className="bg-white border rounded-lg p-4"
            >
                <div
                  className="flex items-center justify-between"
                >
                    <p
                      className="text-lg font-semibold"
                    >
                        Projects ({total})
                    </p>

                    <Button
                      onClick={createProject}
                      size="icon"
                      variant="secondary"
                    >
                        <PlusIcon
                          className="size-4 text-neutral-500"
                        />
                    </Button>
                </div>

                <DottedSeparator
                  className="my-4"
                />

                <ul
                  className="grid grid-cols-1 lg:grid-cols-2 gap-4"
                >
                    {data.map((project) => (
                        <li
                          key={project.$id}
                        >
                            <Link
                              href={`/workspaces/${workspaceId}/projects/${project.$id}`}
                            >
                                <Card
                                  className="rounded-lg hover:opacity-75 shadow-none transition"
                                >
                                    <CardContent
                                      className="flex items-center p-4 gap-x-2.5"
                                    >
                                        <ProjectsAvatar
                                          className="size-8"
                                          fallbackClassName="text-lg"
                                          name={project.name}
                                          image={project.imageUrl}
                                        />
                                        <p
                                          className="text-base font-medium truncate"
                                        >
                                            {project.name}
                                        </p>
                                    </CardContent>
                                </Card>
                            </Link>
                        </li>
                    ))}
                    <li
                      className="text-sm text-muted-foreground text-center hidden first-of-type:block"
                    >
                        No projects found.
                    </li>
                </ul>
            </div>
        </div>
    )
};

interface MemberListProps {
    data: Member[];
    total: number;
}

export const MemberList = ({
    data,
    total
}: MemberListProps) => {
    const workspaceId = useWorkspaceId();

    return (
        <div
          className="flex flex-col gap-y-4 col-span-1"
        >
            <div
              className="bg-white border rounded-lg p-4"
            >
                <div
                  className="flex items-center justify-between"
                >
                    <p
                      className="text-lg font-semibold"
                    >
                        Members ({total})
                    </p>

                    <Button
                      size="icon"
                      variant="secondary"
                    >
                        <Link
                          href={`/workspaces/${workspaceId}/members`}
                        >
                            <SettingsIcon
                              className="size-4 text-neutral-500"
                            />
                        </Link>
                    </Button>
                </div>

                <DottedSeparator
                  className="my-4"
                />

                <ul
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                    {data.map((member) => (
                        <li
                          key={member.$id}
                        >
                            <Card
                              className="rounded-lg shadow-none overflow-hidden"
                            >
                                <CardContent
                                  className="flex flex-col items-center p-3 gap-y-2"
                                >
                                    <MemberAvatar
                                      className="size-8"
                                      name={member.name}
                                    />

                                    <div
                                      className="flex flex-col items-center overflow-hidden"
                                    >
                                        <p
                                          className="text-base font-medium line-clamp-1"
                                        >
                                            {member.name}
                                        </p>
                                        <p
                                          className="text-xs text-muted-foreground line-clamp-1"
                                        >
                                            {member.email}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </li>
                    ))}
                    <li
                      className="text-sm text-muted-foreground text-center hidden first-of-type:block"
                    >
                        No members found.
                    </li>
                </ul>
            </div>
        </div>
    )
};