import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.tasks[":taskId"]["$delete"], 200>;
type RequestType = InferRequestType<typeof client.api.tasks[":taskId"]["$delete"]>;

export const useDeleteTask = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
      ResponseType,
      Error,
      RequestType
    >({
        mutationFn: async ({ param }) => {
            const res = await client.api.tasks[":taskId"]["$delete"]({ param });

            if (!res.ok) {
                throw new Error("Uh oh, something went wrong while deleting task!");
            }

            return await res.json();
        },
        onSuccess: ({ data }) => {
            toast.success("You have deleted a task!");
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
            queryClient.invalidateQueries({ queryKey: ["task", data.$id] });
        },
        onError: () => {
            toast.error("Uh oh, something went wrong while deleting task!");
        }
    });

    return mutation;
};