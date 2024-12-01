import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { TaskStatus } from "../types";

interface UseGetTasksProps {
    workspaceId: string;
    projectId?: string | null;
    assigneeId?: string | null;
    status?: TaskStatus | null;
    dueDate?: string | null;
    search?: string | null;
}

export const useGetTasks = ({
    workspaceId,
    projectId,
    assigneeId,
    status,
    dueDate,
    search
}: UseGetTasksProps) => {
    const query = useQuery({
        queryKey: [
            "tasks",
            workspaceId,
            projectId,
            assigneeId,
            status,
            dueDate,
            search
        ],
        queryFn: async () => {
            // Make an API call to the workspaces endpoint to get all the projects
            const res = await client.api.tasks.$get({
                query: {
                    workspaceId,
                    projectId: projectId ?? undefined,
                    assigneeId: assigneeId ?? undefined,
                    status: status ?? undefined,
                    dueDate: dueDate ?? undefined,
                    search: search ?? undefined
                }
            });

            // If a problem occurred during the operation, throw an error
            if (!res.ok) {
                throw new Error("Uh oh, something went wrong while fetching your tasks!");
            }

            // Extract the data from the json
            const { data } = await res.json();

            return data;
        }
    });

    return query;
};