import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

interface UseGetWorkspaceInfoProps {
    workspaceId: string;
}

export const useGetWorkspaceInfo = ({ workspaceId }: UseGetWorkspaceInfoProps) => {
    const query = useQuery({
        queryKey: ["workspace", workspaceId],
        queryFn: async () => {
            // Make an API call to the workspaces endpoint to get a selected project
            const res = await client.api.workspaces[":workspaceId"]["info"].$get({
                param: { workspaceId }
            });

            // If a problem occurred during the operation, throw an error
            if (!res.ok) {
                throw new Error("Uh oh, something went wrong while fetching workspace's information!");
            }

            // Extract the data from the json
            const { data } = await res.json();

            return data;
        }
    });

    return query;
};