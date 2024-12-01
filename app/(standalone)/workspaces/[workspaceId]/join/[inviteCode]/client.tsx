"use client";

import PageError from "@/components/page-error";
import PageLoader from "@/components/page-loader";

import JoinWorkspaceForm from "@/features/workspaces/components/join-workspace-form";
import { useGetWorkspaceInfo } from "@/features/workspaces/api/use-get-workspace-info";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

const JoinWorkspacePageClient = () => {
    const workspaceId = useWorkspaceId();

    const { data: initialValues, isLoading } = useGetWorkspaceInfo({ workspaceId });

    if (isLoading) {
        return (
            <PageLoader />
        )
    }

    if (!initialValues) {
        return (
            <PageError
              message="Failed to load workspace's information"
            />
        )
    }

    return (
        <div
          className="w-full lg:max-w-xl"
        >
            <JoinWorkspaceForm
              initialValues={initialValues}
            />
        </div>
    );
}
 
export default JoinWorkspacePageClient;