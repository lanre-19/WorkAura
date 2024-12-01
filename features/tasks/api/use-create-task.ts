import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.tasks["$post"], 200>;
type RequestType = InferRequestType<typeof client.api.tasks["$post"]>;

export const useCreateTask = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
      ResponseType,
      Error,
      RequestType
    >({
        mutationFn: async ({ json }) => {
            const res = await client.api.tasks["$post"]({ json });

            if (!res.ok) {
                throw new Error("Uh oh, something went wrong while creating task!");
            }

            return await res.json();
        },
        onSuccess: () => {
            toast.success("You have created a task!");
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
        onError: () => {
            toast.error("Uh oh, something went wrong while creating task!");
        }
    });

    return mutation;
};