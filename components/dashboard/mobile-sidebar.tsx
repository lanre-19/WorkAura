"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MenuIcon } from "lucide-react";

import Sidebar from "./sidebar";

import {
    Sheet,
    SheetContent,
    SheetTrigger
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const MobileSidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    return (
        <Sheet
          modal={false}
          open={isOpen}
          onOpenChange={setIsOpen}
        >
            <SheetTrigger
              asChild
            >
                <Button
                  className="lg:hidden rounded-lg"
                  variant="secondary"
                  size="icon"
                >
                    <MenuIcon
                      className="size-5 text-neutral-500"
                    />
                </Button>
            </SheetTrigger>
            <SheetContent
              className=" p-0"
              side="left"
            >
                <Sidebar />
            </SheetContent>
        </Sheet>
    );
}
 
export default MobileSidebar;