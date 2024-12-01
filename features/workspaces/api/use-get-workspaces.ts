import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

export const useGetWorkspaces = () => {
    const query = useQuery({
        queryKey: ["workspaces"],
        queryFn: async () => {
            // Make an API call to the workspaces endpoint to get all the workspaces
            const res = await client.api.workspaces.$get();

            // If the response is not as expected, do not return anything
            if (!res.ok) {
                throw new Error("Uh oh, something went wrong while fetching your workspaces!");
            }

            // Extract the data from the json
            const { data } = await res.json();

            return data;
        }
    });

    return query;
};