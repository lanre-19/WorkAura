import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.auth.login["$post"]>;
type RequestType = InferRequestType<typeof client.api.auth.login["$post"]>;

export const useLogin = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const mutation = useMutation<
      ResponseType,
      Error,
      RequestType
    >({
        mutationFn: async ({ json }) => {
            const res = await client.api.auth.login["$post"]({ json });

            if (!res.ok) {
                throw new Error("Uh oh, something went wrong while signing in!");
            }

            return await res.json();
        },
        onSuccess: () => {
            toast.success("Welcome back, you!");
            queryClient.invalidateQueries({ queryKey: ["current"] });
            router.refresh();
        },
        onError: () => {
            toast.error("Uh oh, something went wrong while signing in!");
        }
    });

    return mutation;
};