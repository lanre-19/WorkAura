import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.auth.logout["$post"]>;

export const useLogout = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const mutation = useMutation<
      ResponseType,
      Error
    >({
        mutationFn: async () => {
            const res = await client.api.auth.logout["$post"]();

            if (!res.ok) {
                throw new Error("Uh oh, something went wrong while signing out!");
            }

            return await res.json();
        },
        onSuccess: () => {
            toast.success("Bye, hope to see you soon!");
            router.refresh();
            queryClient.invalidateQueries({ queryKey: ["current"] });
            queryClient.invalidateQueries({ queryKey: ["workspaces"] });
        },
        onError: () => {
            toast.error("Uh oh, something went wrong while signing out!");
        }
    });

    return mutation;
};