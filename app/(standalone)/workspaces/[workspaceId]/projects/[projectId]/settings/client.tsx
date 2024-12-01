"use client";

import PageLoader from "@/components/page-loader";

import UpdateProjectForm from "@/features/projects/components/update-project-form";
import { useGetProject } from "@/features/projects/api/use-get-project";
import { useProjectId } from "@/features/projects/hooks/use-project-id";
import PageError from "@/components/page-error";

const ProjectIdSettingsClient = () => {
    const projectId = useProjectId();

    const { data: initialValues, isLoading } = useGetProject({ projectId });

    if (isLoading) {
        return (
            <PageLoader />
        )
    }
    
    if (!initialValues) {
        return (
            <PageError
              message="Failed to load project"
            />
        )
    }

    return (
        <div
          className="w-full lg:max-w-xl"
        >
            <UpdateProjectForm
              initialValues={initialValues}
            />   
        </div>
    );
}
 
export default ProjectIdSettingsClient;