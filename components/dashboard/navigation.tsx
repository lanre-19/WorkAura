"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    GoCheckCircle,
    GoCheckCircleFill,
    GoHome,
    GoHomeFill
} from "react-icons/go";
import { SettingsIcon, UsersIcon } from "lucide-react";

import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

import { cn } from "@/lib/utils";

const routes = [
    {
        label: "Home",
        href: "",
        icon: GoHome,
        activeIcon: GoHomeFill
    },
    {
        label: "Tasks",
        href: "/tasks",
        icon: GoCheckCircle,
        activeIcon: GoCheckCircleFill
    },
    {
        label: "Settings",
        href: "/settings",
        icon: SettingsIcon,
        activeIcon: SettingsIcon
    },
    {
        label: "Members",
        href: "/members",
        icon: UsersIcon,
        activeIcon: UsersIcon
    },
];

const Navigation = () => {
    const pathname = usePathname();
    const workspaceId = useWorkspaceId();

    return (
        <ul
          className="flex flex-col"
        >
            {routes.map((route) => {
                const fullHref = `/workspaces/${workspaceId}${route.href}`;
                const isActive = pathname === fullHref;
                const Icon = isActive ? route.activeIcon : route.icon;

                return (
                    <Link
                      key={route.href}
                      href={fullHref}
                    >
                        <div
                          className={cn(
                            "flex items-center gap-2.5 p-2.5 rounded-md text-neutral-500 hover:text-primary font-medium transition",
                            isActive && "text-neutral-600 bg-white hover:opacity-100 font-semibold"
                          )}
                        >
                            <Icon
                              className="size-5 text-neutral-500"
                            />
                            {route.label}
                        </div>
                    </Link>
                )
            })}
        </ul>
    );
}
 
export default Navigation;