import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.tasks[":taskId"]["$patch"], 200>;
type RequestType = InferRequestType<typeof client.api.tasks[":taskId"]["$patch"]>;

export const useUpdateTask = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
      ResponseType,
      Error,
      RequestType
    >({
        mutationFn: async ({ json, param }) => {
            const res = await client.api.tasks[":taskId"]["$patch"]({ json, param });

            if (!res.ok) {
                throw new Error("Uh oh, something went wrong while updating task!");
            }

            return await res.json();
        },
        onSuccess: ({ data }) => {
            toast.success("You have updated your task!");
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
            queryClient.invalidateQueries({ queryKey: ["task", data.$id] });
        },
        onError: () => {
            toast.error("Uh oh, something went wrong while updating task!");
        }
    });

    return mutation;
};