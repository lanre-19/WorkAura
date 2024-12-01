import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

interface UseGetProjectsProps {
    workspaceId: string;
}

export const useGetProjects = ({ workspaceId }: UseGetProjectsProps) => {
    const query = useQuery({
        queryKey: ["projects", workspaceId],
        queryFn: async () => {
            // Make an API call to the workspaces endpoint to get all the projects
            const res = await client.api.projects.$get({
                query: { workspaceId }
            });

            // If a problem occurred during the operation, throw an error
            if (!res.ok) {
                throw new Error("Uh oh, something went wrong while fetching your projects!");
            }

            // Extract the data from the json
            const { data } = await res.json();

            return data;
        }
    });

    return query;
};