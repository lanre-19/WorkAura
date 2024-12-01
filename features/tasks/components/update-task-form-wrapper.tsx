import { Loader } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import UpdateTaskForm from "./update-task-form";

import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

import { useGetTask } from "../api/use-get-task";

interface UpdateTaskFormWrapperProps {
    onCancel?: () => void;
    id: string;
}

const UpdateTaskFormWrapper = ({ onCancel, id }: UpdateTaskFormWrapperProps) => {
    const workspaceId = useWorkspaceId();

    const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
        workspaceId
    });
    const { data: members, isLoading: isLoadingMembers } = useGetMembers({
        workspaceId
    });

    const { data: initialValues, isLoading: isLoadingTask } = useGetTask({
        taskId: id
    });
    
    // Create a list of project options
    const projectOptions = projects?.documents.map((project) => ({
        id: project.$id,
        name: project.name,
        imageUrl: project.imageUrl
    }));

    // Create a list of member options
    const memberOptions = members?.documents.map((member) => ({
        id: member.$id,
        name: member.name
    }));

    const isLoading = isLoadingProjects || isLoadingMembers || isLoadingTask;

    if (isLoading) {
        return (
            <Card
              className="w-full h-[714px] border-none shadow-none"
            >
                <CardContent
                  className="flex items-center justify-center h-full"
                >
                    <Loader
                      className="size-5 text-muted-foreground animate-spin"
                    />
                </CardContent>
            </Card>
        )
    }

    if (!initialValues) {
        return null;
    }

    return (
        <UpdateTaskForm
          onCancel={onCancel}
          projectOptions={projectOptions ?? []}
          memberOptions={memberOptions ?? []}
          initialValues={initialValues}
        />
    );
}
 
export default UpdateTaskFormWrapper;