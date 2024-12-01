import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.auth.register["$post"]>;
type RequestType = InferRequestType<typeof client.api.auth.register["$post"]>;

export const useRegister = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    
    const mutation = useMutation<
      ResponseType,
      Error,
      RequestType
    >({
        mutationFn: async ({ json }) => {
            const res = await client.api.auth.register["$post"]({ json });

            if (!res.ok) {
                throw new Error("Uh oh, something went wrong while creating an account!");
            }

            return await res.json();
        },
        onSuccess: () => {
            toast.success("Yay, you just created an account!");
            router.refresh();
            queryClient.invalidateQueries({ queryKey: ["current"] });
        },
        onError: () => {
            toast.error("Uh oh, something went wrong while creating an account!");
        }
    });

    return mutation;
};