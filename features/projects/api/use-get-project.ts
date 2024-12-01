import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

interface UseGetProjectProps {
    projectId: string;
}

export const useGetProject = ({ projectId }: UseGetProjectProps) => {
    const query = useQuery({
        queryKey: ["project", projectId],
        queryFn: async () => {
            // Make an API call to the workspaces endpoint to get a selected project
            const res = await client.api.projects[":projectId"].$get({
                param: { projectId }
            });

            // If a problem occurred during the operation, throw an error
            if (!res.ok) {
                throw new Error("Uh oh, something went wrong while fetching your project!");
            }

            // Extract the data from the json
            const { data } = await res.json();

            return data;
        }
    });

    return query;
};