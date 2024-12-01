"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

import DottedSeparator from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardTitle,
    CardContent,
    CardHeader,
    CardDescription
} from "@/components/ui/card";

import { useJoinWorkspace } from "../api/use-join-workspace";
import { useInviteCode } from "../hooks/use-invite-code";
import { useWorkspaceId } from "../hooks/use-workspace-id";
import { toast } from "sonner";

interface JoinWorkspaceFormProps {
    initialValues: {
        name: string;
    }
}

const JoinWorkspaceForm = ({ initialValues }: JoinWorkspaceFormProps) => {
    const { mutate, isPending } = useJoinWorkspace();
    const router = useRouter();
    const inviteCode = useInviteCode();
    const workspaceId = useWorkspaceId();

    const onSubmit = () => {
        mutate({
            param: { workspaceId },
            json: { code: inviteCode }
        }, {
            onSuccess: ({ data }) => {
                toast.success(`You just joined ${data.name} workspace!`);
                router.push(`/workspaces/${data.$id}`);
            }
        });
    };

    return (
        <Card
          className="w-full h-full border-none shadow-none"
        >
            <CardHeader
              className="p-7"
            >
                <CardTitle
                  className="text-xl font-bold"
                >
                    Join Workspace
                </CardTitle>
                <CardDescription>
                    You&apos;ve been invited to join <strong>{initialValues.name}</strong> workspace
                </CardDescription>
            </CardHeader>

            <div
              className="px-7"
            >
                <DottedSeparator />
            </div>

            <CardContent
              className="p-7"
            >
                <div
                  className="flex flex-col lg:flex-row items-center justify-between gap-2"
                >
                    <Button
                      asChild
                      className="w-full lg:w-fit"
                      type="button"
                      variant="secondary"
                      size="lg"
                      disabled={isPending}
                    >
                        <Link
                          href="/"
                        >
                            Cancel
                        </Link>
                    </Button>
                    <Button
                      onClick={onSubmit}
                      className="w-full lg:w-fit"
                      type="button"
                      size="lg"
                      disabled={isPending}
                    >
                        {isPending && (
                            <Loader
                              className="w-4 h-4 mr-2 animate-spin"
                            />
                        )}
                        Join Workspace
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
 
export default JoinWorkspaceForm;