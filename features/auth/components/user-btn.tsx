"use client";

import { Loader, LogOut } from "lucide-react";

import DottedSeparator from "@/components/dotted-separator";
import {
    Avatar,
    AvatarFallback
} from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import { useLogout } from "../api/use-logout";
import { useCurrent } from "../api/use-current";

const UserBtn = () => {
    const { data: user, isLoading } = useCurrent();
    const { mutate: logout } = useLogout();

    // Check if there is no current user. If true, do not return anything
    if (!user) {
        return null;
    }

    // Extract the name and email from the user
    const { name, email } = user;

    // Fallback for the user avatar
    const avatarFallback = name ? name.charAt(0).toUpperCase() : email.charAt(0).toUpperCase() ?? "U";

    if (isLoading) {
        return (
            <div
              className="flex items-center justify-center rounded-full size-10 bg-neutral-200 border border-neutral-300"
            >
                <Loader
                  className="size-4 text-muted-foreground animate-spin"
                />
            </div>
        )
    }

    return (
        <DropdownMenu
          modal={false}
        >
            <DropdownMenuTrigger
              className="outline-none relative"
            >
                <Avatar
                  className="size-10 hover:opacity-75 transition border border-neutral-300"
                >
                    <AvatarFallback
                      className="flex items-center justify-center bg-neutral-200 text-neutral-500 font-medium"
                    >
                        {avatarFallback}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="w-60"
              side="bottom"
              align="end"
              sideOffset={10}
            >
                <div
                  className="flex flex-col items-center justify-center gap-2 px-2.5 py-4"
                >
                    <Avatar
                      className="size-[52px] border border-neutral-300"
                    >
                        <AvatarFallback
                          className="flex items-center justify-center bg-neutral-200 text-xl text-neutral-500 font-medium"
                        >
                            {avatarFallback}
                        </AvatarFallback>
                    </Avatar>
                    <div
                      className="flex flex-col items-center justify-center"
                    >
                        <p
                          className="text-sm font-medium text-neutral-900"
                        >
                            {name || "User"}
                        </p>
                        <p
                          className="text-xs text-neutral-500"
                        >
                            {email}
                        </p>
                    </div>
                </div>

                <DottedSeparator
                  className="mb-1"
                />

                <DropdownMenuItem
                  onClick={() => logout()}
                  className="flex items-center justify-center h-10 text-amber-700 font-medium cursor-pointer"
                >
                    <LogOut
                      className="size-4 mr-2"
                    />
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
 
export default UserBtn;