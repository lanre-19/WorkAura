import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.workspaces[":workspaceId"]["join"]["$post"], 200>;
type RequestType = InferRequestType<typeof client.api.workspaces[":workspaceId"]["join"]["$post"]>;

export const useJoinWorkspace = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
      ResponseType,
      Error,
      RequestType
    >({
        mutationFn: async ({ param, json }) => {
            const res = await client.api.workspaces[":workspaceId"]["join"]["$post"]({ param, json });

            if (!res.ok) {
                throw new Error("Uh oh, something went wrong while joining workspace!");
            }

            return await res.json();
        },
        onSuccess: ({ data }) => {
            toast.success("You have joined workspace!");
            queryClient.invalidateQueries({ queryKey: ["workspaces"] });
            queryClient.invalidateQueries({ queryKey: ["workspace", data.$id] });
        },
        onError: () => {
            toast.error("Uh oh, something went wrong while joining workspace!");
        }
    });

    return mutation;
};