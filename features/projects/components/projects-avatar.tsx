import Image from "next/image";

import { cn } from "@/lib/utils";

import {
    Avatar,
    AvatarFallback
} from "@/components/ui/avatar";

interface ProjectsAvatarProps {
    image?: string;
    className?: string;
    name: string;
    fallbackClassName?: string;
}

const ProjectsAvatar = ({
    image,
    className,
    name,
    fallbackClassName
}: ProjectsAvatarProps) => {

    if (image) {
        return (
            <div
              className={cn(
                "size-5 relative rounded-md overflow-hidden",
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
            "size-5 rounded-md",
            className
          )}
        >
            <AvatarFallback
              className={cn(
                "text-sm text-white font-semibold rounded-md bg-[#0077b6] uppercase",
                fallbackClassName
              )}
            >
                {name[0]}
            </AvatarFallback>
        </Avatar>
    );
}
 
export default ProjectsAvatar;