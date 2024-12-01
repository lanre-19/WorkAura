import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.members[":memberId"]["$patch"], 200>;
type RequestType = InferRequestType<typeof client.api.members[":memberId"]["$patch"]>;

export const useUpdateMember = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
      ResponseType,
      Error,
      RequestType
    >({
        mutationFn: async ({ param, json }) => {
            const res = await client.api.members[":memberId"]["$patch"]({ param, json });

            if (!res.ok) {
                throw new Error("Uh oh, something went wrong while updating member!");
            }

            return await res.json();
        },
        onSuccess: () => {
            toast.success("You have updated member in this workspace!");
            queryClient.invalidateQueries({ queryKey: ["members"] });
        },
        onError: () => {
            toast.error("Uh oh, something went wrong while updating member!");
        }
    });

    return mutation;
};