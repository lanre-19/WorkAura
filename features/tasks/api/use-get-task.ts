import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

interface UseGetTaskProps {
    taskId: string;
}

export const useGetTask = ({ taskId }: UseGetTaskProps) => {
    const query = useQuery({
        queryKey: [
            "task",
            taskId
        ],
        queryFn: async () => {
            // Make an API call to the workspaces endpoint to get all the projects
            const res = await client.api.tasks[":taskId"].$get({ param: { taskId } });

            // If a problem occurred during the operation, throw an error
            if (!res.ok) {
                throw new Error("Uh oh, something went wrong while fetching your task!");
            }

            // Extract the data from the json
            const { data } = await res.json();

            return data;
        }
    });

    return query;
};