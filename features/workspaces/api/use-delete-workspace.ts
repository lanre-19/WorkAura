import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.workspaces[":workspaceId"]["$delete"], 200>;
type RequestType = InferRequestType<typeof client.api.workspaces[":workspaceId"]["$delete"]>;

export const useDeleteWorkspace = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    const mutation = useMutation<
      ResponseType,
      Error,
      RequestType
    >({
        mutationFn: async ({ param }) => {
            const res = await client.api.workspaces[":workspaceId"]["$delete"]({ param });

            if (!res.ok) {
                throw new Error("Uh oh, something went wrong while deleting workspace!");
            }

            return await res.json();
        },
        onSuccess: ({ data }) => {
            toast.success("You have deleted this workspace!");
            router.refresh();
            queryClient.invalidateQueries({ queryKey: ["workspaces"] });
            queryClient.invalidateQueries({ queryKey: ["workspace", data.$id] });
        },
        onError: () => {
            toast.error("Uh oh, something went wrong while deleting workspace!");
        }
    });

    return mutation;
};