import Image from "next/image";

import { cn } from "@/lib/utils";

import {
    Avatar,
    AvatarFallback
} from "@/components/ui/avatar";

interface MemberAvatarProps {
    className?: string;
    name: string;
    fallbackClassName?: string;
}

const MemberAvatar = ({
    className,
    name,
    fallbackClassName
}: MemberAvatarProps) => {
    return (
        <Avatar
          className={cn(
            "size-5 transition border border-neutral-300 rounded-full",
            className
          )}
        >
            <AvatarFallback
              className={cn(
                "flex items-center justify-center text-neutral-500 bg-neutral-200 font-medium",
                fallbackClassName
              )}
            >
                {name.charAt(0).toUpperCase()}
            </AvatarFallback>
        </Avatar>
    );
}
 
export default MemberAvatar;