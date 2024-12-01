import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

export const useCurrent = () => {
    const query = useQuery({
        queryKey: ["current"],
        queryFn: async () => {
            const res = await client.api.auth.current.$get();

            // If there is no expected response, do not return anything
            if (!res.ok) {
                return null;
            }

            const { data } = await res.json();

            return data;
        }
    });

    return query;
};