import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

interface UseGetMembersProps {
    workspaceId: string;
}

export const useGetMembers = ({ workspaceId }: UseGetMembersProps) => {
    const query = useQuery({
        queryKey: ["members", workspaceId],
        queryFn: async () => {
            // Make an API call to the workspaces endpoint to get all the members
            const res = await client.api.members.$get({ query: { workspaceId } });

            // If the response is not as expected, do not return anything
            if (!res.ok) {
                throw new Error("Uh oh, something went wrong while fetching members in workspace!");
            }

            // Extract the data from the json
            const { data } = await res.json();

            return data;
        }
    });

    return query;
};