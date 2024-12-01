import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.workspaces[":workspaceId"]["$patch"], 200>;
type RequestType = InferRequestType<typeof client.api.workspaces[":workspaceId"]["$patch"]>;

export const useUpdateWorkspace = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
      ResponseType,
      Error,
      RequestType
    >({
        mutationFn: async ({ form, param }) => {
            const res = await client.api.workspaces[":workspaceId"]["$patch"]({ form, param });

            if (!res.ok) {
                throw new Error("Uh oh, something went wrong while updating workspace!");
            }

            return await res.json();
        },
        onSuccess: ({ data }) => {
            toast.success("You have updated your workspace!");
            queryClient.invalidateQueries({ queryKey: ["workspaces"] });
            queryClient.invalidateQueries({ queryKey: ["workspace", data.$id] });
        },
        onError: () => {
            toast.error("Uh oh, something went wrong while updating workspace!");
        }
    });

    return mutation;
};