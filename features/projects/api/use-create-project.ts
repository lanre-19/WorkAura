import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.projects["$post"], 200>;
type RequestType = InferRequestType<typeof client.api.projects["$post"]>;

export const useCreateProject = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
      ResponseType,
      Error,
      RequestType
    >({
        mutationFn: async ({ form }) => {
            const res = await client.api.projects["$post"]({ form });

            if (!res.ok) {
                throw new Error("Uh oh, something went wrong while creating project!");
            }

            return await res.json();
        },
        onSuccess: () => {
            toast.success("You have created a project!");
            queryClient.invalidateQueries({ queryKey: ["projects"] });
        },
        onError: () => {
            toast.error("Uh oh, something went wrong while creating project!");
        }
    });

    return mutation;
};