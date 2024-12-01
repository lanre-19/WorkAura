import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.tasks["bulk-update"]["$post"], 200>;
type RequestType = InferRequestType<typeof client.api.tasks["bulk-update"]["$post"]>;

export const useBulkUpdateTask = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
      ResponseType,
      Error,
      RequestType
    >({
        mutationFn: async ({ json }) => {
            const res = await client.api.tasks["bulk-update"]["$post"]({ json });

            if (!res.ok) {
                throw new Error("Uh oh, something went wrong while updating tasks!");
            }

            return await res.json();
        },
        onSuccess: () => {
            toast.success("You have updated your tasks!");
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
        onError: () => {
            toast.error("Uh oh, something went wrong while updating tasks!");
        }
    });

    return mutation;
};