import { InferResponseType } from "hono";
import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

interface UseGetProjectAnalyticsProps {
    projectId: string;
}

export type ProjectAnalyticsResponseType = InferResponseType<typeof client.api.projects[":projectId"]["analytics"]["$get"], 200>;

export const useGetProjectAnalytics = ({ projectId }: UseGetProjectAnalyticsProps) => {
    const query = useQuery({
        queryKey: ["project-analytics", projectId],
        queryFn: async () => {
            // Make an API call to the workspaces endpoint to get a selected project analytics
            const res = await client.api.projects[":projectId"]["analytics"].$get({
                param: { projectId }
            });

            // If a problem occurred during the operation, throw an error
            if (!res.ok) {
                throw new Error("Uh oh, something went wrong while fetching your project analytics!");
            }

            // Extract the data from the json
            const { data } = await res.json();

            return data;
        }
    });

    return query;
};