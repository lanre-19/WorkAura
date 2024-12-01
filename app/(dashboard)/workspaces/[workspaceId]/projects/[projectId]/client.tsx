"use client";

import Link from "next/link";
import { PencilIcon } from "lucide-react";

import PageLoader from "@/components/page-loader";
import PageError from "@/components/page-error";
import Analytics from "@/components/analytics";
import { Button } from "@/components/ui/button";

import ProjectsAvatar from "@/features/projects/components/projects-avatar";
import TasksViewSwitcher from "@/features/tasks/components/tasks-view-switcher";
import { useProjectId } from "@/features/projects/hooks/use-project-id";
import { useGetProject } from "@/features/projects/api/use-get-project";
import { useGetProjectAnalytics } from "@/features/projects/api/use-get-project-analytics";

const ProjectIdClient = () => {
  const projectId = useProjectId();

  const { data: project, isLoading: isLoadingProject } = useGetProject({
    projectId,
  });
  const { data: projectAnalytics, isLoading: isLoadingProjectAnalytics } = useGetProjectAnalytics({ projectId });

  const isLoading = isLoadingProject || isLoadingProjectAnalytics;

  if (isLoading) {
    return (
      <PageLoader />
    );
  }

  if (!project) {
    return (
      <PageError message="Failed to load project" />
    );
  }

  return (
    <div
      className="flex flex-col h-full gap-y-4"
    >
      <div
        className="flex items-center justify-between"
      >
        <div
          className="flex items-center gap-x-2"
        >
          <ProjectsAvatar
            name={project.name}
            image={project.imageUrl}
            className="size-5 lg:size-7"
          />
          <p
            className="text-sm lg:text-base font-semibold"
          >
            {project.name}
          </p>
        </div>
        <div>
          <Button
            asChild
            size="sm"
            variant="secondary"
          >
            <Link
              href={`/workspaces/${project.workspaceId}/projects/${project.$id}/settings`}
            >
              <PencilIcon
                className="size-4 mr-2"
              />
              Edit project
            </Link>
          </Button>
        </div>
      </div>

      {projectAnalytics ? (
        <Analytics
          data={projectAnalytics}
        />
      ) : null}

      <TasksViewSwitcher
        hideProjectFilter
      />
    </div>
  );
};

export default ProjectIdClient;
