"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { RiAddCircleFill } from "react-icons/ri";
import { Loader } from "lucide-react";

import ProjectsAvatar from "@/features/projects/components/projects-avatar";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal";

import { cn } from "@/lib/utils";

const Projects = () => {
  const pathname = usePathname();
  const workspaceId = useWorkspaceId();

  const { open } = useCreateProjectModal();
  const { data, isFetching } = useGetProjects({ workspaceId });

  const scrollContainerRef = useRef<any>(null);
  const [isBottomFaded, setIsBottomFaded] = useState(true);

  const handleScroll = () => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    // Calculate if we're near the bottom of the scroll container
    const nearBottom =
      scrollContainer.scrollHeight - scrollContainer.scrollTop <=
      scrollContainer.clientHeight + 10;

    setIsBottomFaded(!nearBottom);
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return (
    <div
      className="relative flex flex-col gap-y-2 h-full"
    >
      <div
        className="absolute top-0 left-0 right-0 h-[55px] bg-gradient-to-b from-neutral-100 to-transparent z-10 pointer-events-none"
      />

      <div
        className="flex items-center justify-between mb-1.5 sticky top-0 bg-neutral-100 z-20"
      >
        <p
          className="text-xs text-neutral-500 uppercase"
        >
          Projects
        </p>
        <RiAddCircleFill
          onClick={open}
          className="size-5 text-neutral-500 hover:opacity-75 cursor-pointer transition"
        />
      </div>

      <div
        className="overflow-y-auto flex-grow relative"
        ref={scrollContainerRef}
      >
        {data?.documents.length === 0 ? (
          <div
            className="flex w-full h-full items-center justify-center"
          >
            <span
              className="text-xs text-muted-foreground"
            >
              There&apos;s no project here.
            </span>
          </div>
        ) : isFetching ? (
          <div
            className="flex w-full h-full items-center justify-center"
          >
            <Loader
              className="size-4 text-muted-foreground animate-spin"
            />
          </div>
        ) : data?.documents.map((project) => {
          const href = `/workspaces/${workspaceId}/projects/${project.$id}`;
          const isActive = pathname === href;

          return (
            <Link
              key={project.$id}
              href={href}
            >
              <div
                className={cn(
                  "flex items-center gap-3 p-2.5 rounded-md text-neutral-500 hover:text-primary font-medium transition",
                  isActive &&
                    "text-neutral-600 bg-white hover:opacity-100 font-semibold"
                )}
              >
                <ProjectsAvatar
                  name={project.name}
                  image={project.imageUrl}
                />
                <span
                  className="truncate"
                >
                  {project.name}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {isBottomFaded && (
        <div className="absolute bottom-0 left-0 right-0 h-[55px] bg-gradient-to-t from-neutral-100 to-transparent z-10 pointer-events-none" />
      )}
    </div>
  );
};

export default Projects;
