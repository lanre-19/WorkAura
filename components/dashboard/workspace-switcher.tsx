"use client";

import { useRouter } from "next/navigation";
import { RiAddCircleFill } from "react-icons/ri";

import {
    Select,
    SelectItem,
    SelectValue,
    SelectTrigger,
    SelectContent
} from "@/components/ui/select";

import WorkspacesAvatar from "@/features/workspaces/components/workspaces-avatar";

import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useCreateWorkspaceModal } from "@/features/workspaces/hooks/use-create-workspace-modal";
import { Loader } from "lucide-react";

const WorkspaceSwitcher = () => {
    const router = useRouter();
    const workspaceId = useWorkspaceId();
    const { open } = useCreateWorkspaceModal();
    const { data: workspaces, isFetching } = useGetWorkspaces();

    // Redirect users to the selected workspace
    const onSelect = (id: string) => {
      router.push(`/workspaces/${id}`);
    };
    
    return (
        <div
          className="flex flex-col gap-y-2"
        >
            <div
              className="flex items-center justify-between"
            >
                <p
                  className="text-xs text-neutral-500 uppercase"
                >
                    Workspaces
                </p>
                <RiAddCircleFill
                  onClick={open}
                  className="size-5 text-neutral-500 hover:opacity-75 cursor-pointer transition"
                />
            </div>

            {isFetching ? (
              <div
                className="flex w-full h-full items-center justify-center my-5"
              >
                <Loader
                  className="size-4 text-muted-foreground animate-spin"
                />
              </div> )
              : <Select
                  onValueChange={onSelect}
                  value={workspaceId}
                >
                  <SelectTrigger
                    className="w-full text-neutral-600 bg-neutral-200/20 font-medium p-2 mt-1.5"
                  >
                  <SelectValue
                    placeholder="Select a workspace"
                  />
                </SelectTrigger>
                
                <SelectContent>
                    {workspaces?.documents.map((workspace) => (
                        <SelectItem
                          key={workspace.$id}
                          value={workspace.$id}
                        >
                            <div
                              className="flex items-center justify-center gap-3 font-medium"
                            >
                                <WorkspacesAvatar
                                  name={workspace.name}
                                  image={workspace.imageUrl}
                                />
                                <span
                                  className="truncate"
                                >
                                    {workspace.name}
                                </span>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>}
        </div>
    );
}
 
export default WorkspaceSwitcher;