"use client";

import PageError from "@/components/page-error";
import PageLoader from "@/components/page-loader";

import UpdateWorkspaceForm from "@/features/workspaces/components/update-workspace-form";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

const WorkspaceIdSettingsClient = () => {
    const workspaceId = useWorkspaceId();

    const { data: initialValues, isLoading } = useGetWorkspace({ workspaceId });

    if (isLoading) {
        return (
            <PageLoader />
        )
    }

    if (!initialValues) {
        return (
            <PageError
              message="Failed to load workspace"
            />
        )
    }

    return (
        <div
          className="w-full lg:max-w-xl"
        >
            <UpdateWorkspaceForm
              initialValues={initialValues}
            />
        </div>
    );
}
 
export default WorkspaceIdSettingsClient;