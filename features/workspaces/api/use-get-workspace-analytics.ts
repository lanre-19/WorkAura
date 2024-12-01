import { InferResponseType } from "hono";
import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

interface UseGetWorkspaceAnalyticsProps {
    workspaceId: string;
}

export type WorkspaceAnalyticsResponseType = InferResponseType<typeof client.api.workspaces[":workspaceId"]["analytics"]["$get"], 200>;

export const useGetWorkspaceAnalytics = ({ workspaceId }: UseGetWorkspaceAnalyticsProps) => {
    const query = useQuery({
        queryKey: ["workspace-analytics", workspaceId],
        queryFn: async () => {
            // Make an API call to the workspaces endpoint to get a selected project analytics
            const res = await client.api.workspaces[":workspaceId"]["analytics"].$get({
                param: { workspaceId }
            });

            // If a problem occurred during the operation, throw an error
            if (!res.ok) {
                throw new Error("Uh oh, something went wrong while fetching your workspace analytics!");
            }

            // Extract the data from the json
            const { data } = await res.json();

            return data;
        }
    });

    return query;
};