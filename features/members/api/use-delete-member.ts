import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.members[":memberId"]["$delete"], 200>;
type RequestType = InferRequestType<typeof client.api.members[":memberId"]["$delete"]>;

export const useDeleteMember = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
      ResponseType,
      Error,
      RequestType
    >({
        mutationFn: async ({ param }) => {
            const res = await client.api.members[":memberId"]["$delete"]({ param });

            if (!res.ok) {
                throw new Error("Uh oh, something went wrong while removing member from workspace!");
            }

            return await res.json();
        },
        onSuccess: () => {
            toast.success("You have removed member from this workspace!");
            queryClient.invalidateQueries({ queryKey: ["members"] });
        },
        onError: () => {
            toast.error("Uh oh, something went wrong while removing member from workspace!");
        }
    });

    return mutation;
};