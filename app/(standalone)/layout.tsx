import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import UserBtn from "@/features/auth/components/user-btn";

interface StandaloneLayoutProps {
    children: React.ReactNode;
}

const StandaloneLayout = async ({ children }: StandaloneLayoutProps) => {
    return (
        <main
          className="bg-neutral-100 min-h-screen"
        >
            <div
              className="mx-auto max-w-screen-2xl p-4"
            >
                <nav
                  className="flex items-center justify-between h-[73px] px-4"
                >
                    <Link
                      href="/"
                      className="flex items-center gap-x-2"
                    >
                      <Image
                        src="/workaura-logo.svg"
                        alt="WorkAura_Logo"
                        width={152}
                        height={152}
                      />
                      <Button
                        className="bg-white hover:bg-white border-2 rounded-full shadow-none cursor-default uppercase"
                        size="xs"
                        variant="secondary"
                      >
                        Beta
                      </Button>
                    </Link>
                    <UserBtn />
                </nav>
                <div
                  className="flex flex-col items-center justify-center py-4"
                >
                    {children}
                </div>
            </div>
        </main>
    );
}
 
export default StandaloneLayout;