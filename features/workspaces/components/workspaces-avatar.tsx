import Image from "next/image";

import { cn } from "@/lib/utils";

import {
    Avatar,
    AvatarFallback
} from "@/components/ui/avatar";

interface WorkspacesAvatarProps {
    image?: string;
    className?: string;
    name: string;
}

const WorkspacesAvatar = ({
    image,
    className,
    name
}: WorkspacesAvatarProps) => {

    if (image) {
        return (
            <div
              className={cn(
                "size-10 relative rounded-md overflow-hidden",
                className
              )}
            >
                <Image
                  src={image}
                  alt={name}
                  fill
                  className="object-cover"
                />
            </div>
        )
    }
    return (
        <Avatar
          className={cn(
            "size-10 rounded-md",
            className
          )}
        >
            <AvatarFallback
              className="text-lg text-white font-semibold rounded-md bg-[#0077b6] uppercase"
            >
                {name[0]}
            </AvatarFallback>
        </Avatar>
    );
}
 
export default WorkspacesAvatar;