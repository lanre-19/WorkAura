import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.workspaces["$post"]>;
type RequestType = InferRequestType<typeof client.api.workspaces["$post"]>;

export const useCreateWorkspace = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
      ResponseType,
      Error,
      RequestType
    >({
        mutationFn: async ({ form }) => {
            const res = await client.api.workspaces["$post"]({ form });

            if (!res.ok) {
                throw new Error("Uh oh, something went wrong while creating workspace!");
            }

            return await res.json();
        },
        onSuccess: () => {
            toast.success("You have created a workspace!");
            queryClient.invalidateQueries({ queryKey: ["workspaces"] });
        },
        onError: () => {
            toast.error("Uh oh, something went wrong while creating workspace!");
        }
    });

    return mutation;
};