import Image from "next/image";
import Link from "next/link";

import DottedSeparator from "../dotted-separator";
import Navigation from "./navigation";
import WorkspaceSwitcher from "./workspace-switcher";
import Projects from "./projects";
import { Button } from "../ui/button";

const Sidebar = () => {
    return (
        <aside className="w-full h-full bg-neutral-100 p-4 flex flex-col hide-scrollbar">
            <Link
              href="/"
              className="flex items-center gap-x-2 mt-2"
            >
                <Image
                  src="/workaura-logo.svg"
                  alt="WorkAura_Logo"
                  width={164}
                  height={164}
                />
                <Button
                  className="bg-white hover:bg-white border-2 rounded-full shadow-none cursor-default uppercase"
                  size="xs"
                  variant="secondary"
                >
                  Beta
                </Button>
            </Link>

            <DottedSeparator className="my-4" />

            <WorkspaceSwitcher />

            <DottedSeparator className="my-4" />

            <Navigation />

            <DottedSeparator className="my-4" />

            <div className="flex-grow overflow-y-auto">
              <Projects />
            </div>
        </aside>
    );
}

export default Sidebar;
