import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.workspaces[":workspaceId"]["reset-invite-code"]["$post"], 200>;
type RequestType = InferRequestType<typeof client.api.workspaces[":workspaceId"]["reset-invite-code"]["$post"]>;

export const useResetInviteCode = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
      ResponseType,
      Error,
      RequestType
    >({
        mutationFn: async ({ param }) => {
            const res = await client.api.workspaces[":workspaceId"]["reset-invite-code"]["$post"]({ param });

            if (!res.ok) {
                throw new Error("Uh oh, something went wrong while resetting invite code!");
            }

            return await res.json();
        },
        onSuccess: ({ data }) => {
            toast.success("Invitation link of this workspace has been reset!");
            queryClient.invalidateQueries({ queryKey: ["workspaces"] });
            queryClient.invalidateQueries({ queryKey: ["workspace", data.$id] });
        },
        onError: () => {
            toast.error("Uh oh, something went wrong while resetting invite code!");
        }
    });

    return mutation;
};