"use client";

import { usePathname } from "next/navigation";

import MobileSidebar from "./mobile-sidebar";

import UserBtn from "@/features/auth/components/user-btn";

const pathnameMap = {
  "tasks": {
    title: "Tasks",
    description: "Manage all your tasks here"
  },
  "projects": {
    title: "Project",
    description: "Manage all the tasks for your projects here"
  },
};

const defaultMap = {
  title: "Home",
  description: "Manage all your tasks and projects here"
}

const Navbar = () => {
    const pathname = usePathname();
    const pathnameParts = pathname.split("/");
    const pathnameKey = pathnameParts[3] as keyof typeof pathnameMap;

    const { title, description } = pathnameMap[pathnameKey] || defaultMap;
  
    return (
        <nav
          className="flex items-center justify-between pt-4 px-6"
        >
            <div
              className="flex-col hidden lg:flex"
            >
                <h1
                  className="text-2xl font-bold"
                >
                    {title}
                </h1>
                <p
                  className="text-muted-foreground"
                >
                    {description}
                </p>
            </div>

            <MobileSidebar />
            <UserBtn />
        </nav>
    );
}
 
export default Navbar;