"use client";

import Link from "next/link";
import { Fragment } from "react";
import { Loader, MoreVertical } from "lucide-react";
import { toast } from "sonner";

import DottedSeparator from "@/components/dotted-separator";
import {
    Card,
    CardContent,
    CardTitle,
    CardHeader
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import MemberAvatar from "@/features/members/components/member-avatar";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useDeleteMember } from "@/features/members/api/use-delete-member";
import { useUpdateMember } from "@/features/members/api/use-update-member";
import { MemberRole } from "@/features/members/types";

import { useConfirm } from "@/hooks/use-confirm";


const MembersLIst = () => {
    const workspaceId = useWorkspaceId();

    const [ConfirmDialog, confirm] = useConfirm(
        "Remove Member",
        "Are you sure? This member will be removed from this workspace.",
        "destructive"
    );

    const { data, isFetching } = useGetMembers({ workspaceId });
    const { mutate: deleteMember, isPending: isDeletingMember } = useDeleteMember();
    const { mutate: updateMember, isPending: isUpdatingMember } = useUpdateMember();

    // Update the roles of members in a workspaces e.g. make an admin, or a member
    const handleUpdate = (
        memberId: string,
        role: MemberRole
    ) => {
        updateMember({
            json: { role },
            param: { memberId }
        }, {
            onSuccess: () => {
                toast.success("Member's role has been updated!");
            }
        });
    };

    // Delete a member from a workspace
    const handleDelete = async (memberId: string) => {
        const ok = await confirm();

        // If an error occurred, stop/break the operation
        if (!ok) {
            return;
        }
        
        // Delete member from workspace
        deleteMember({
            param: { memberId }
        }, {
            onSuccess: () => {
                toast.success("Member has been removed from workspace!");
                window.location.reload();
            }
        });
    };

    return (
        <Card
          className="w-full h-full border-none shadow-none"
        >
            <ConfirmDialog />
            <CardHeader
              className="flex flex-row items-center gap-x-7 p-7 space-y-0"
            >
                <Button
                  asChild
                  size="xs"
                  variant="secondary"
                >
                    <Link
                      href={`/workspaces/${workspaceId}`}
                    >
                        Back
                    </Link>
                </Button>
                
                <CardTitle
                  className="text-2xl font-bold"
                >
                    Members
                </CardTitle>
            </CardHeader>
            
            <div
              className="px-7"
            >
                <DottedSeparator />
            </div>

            <CardContent
              className="p-7"
            >
                {isFetching ? (
                  <div
                    className="flex w-full h-full items-center justify-center my-10"
                  >
                    <Loader
                      className="size-4 text-muted-foreground animate-spin"
                    />
                  </div>
                ) : data?.documents.map((member, i) => (
                    <Fragment
                      key={member.$id}
                    >
                      <div
                        className="flex items-center justify-center gap-2"
                        >
                          <MemberAvatar
                            className="size-10"
                            name={member.name}
                            fallbackClassName="text-lg"
                          />
                          <div
                            className="flex flex-col"
                          >
                            <p
                              className="text-sm font-medium"
                            >
                              {member.name}
                            </p>
                            <p
                              className="text-xs text-muted-foreground"
                            >
                              {member.email}
                            </p>
                          </div>

                          {member.role === MemberRole.ADMIN && (
                            <Button
                              className="border border-neutral-300 cursor-default shadow-none hover:bg-transparent"
                              size="xs"
                              variant="secondary"
                            >
                              <span
                                className="text-xs font-normal rounded-sm"
                              >
                                {member.role}
                              </span>
                            </Button>
                          )}

                          <DropdownMenu>
                            <DropdownMenuTrigger
                              asChild
                            >
                              <Button
                                className="ml-auto border-none shadow-none"
                                size="icon"
                                variant="secondary"
                              >
                                <MoreVertical
                                  className="size-4 text-muted-foreground"
                                />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              className="p-3"
                              side="bottom"
                              align="end"
                            >
                              <DropdownMenuItem
                                onClick={() => handleUpdate(member.$id, MemberRole.ADMIN)}
                                className="font-medium"
                                disabled={isUpdatingMember}
                              >
                                Set as Administrator
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleUpdate(member.$id, MemberRole.MEMBER)}
                                className="font-medium"
                                disabled={isUpdatingMember}
                              >
                                Set as Member
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete(member.$id)}
                                className="text-amber-700 font-medium"
                                disabled={isDeletingMember}
                              >
                                Remove {member.name}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {i < data.documents.length - 1 && (
                          <Separator
                            className="bg-neutral-100 my-2.5"
                          />
                        )}
                  </Fragment>
                ))}
            </CardContent>
        </Card>
    );
}
 
export default MembersLIst;