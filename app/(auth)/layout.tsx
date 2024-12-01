"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

interface AuthLayoutProps {
    children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const pathname = usePathname();

    return (
        <main
          className="bg-neutral-100 min-h-screen"
        >
            <div
              className="mx-auto max-w-screen-2xl p-4"
            >
                <nav
                  className="flex items-center justify-between"
                >
                    <div
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
                    </div>
                    <Button
                      asChild
                      variant="secondary"
                      className="rounded-lg"
                    >
                        <Link
                          href={pathname === "/sign-in" ? "/sign-up" : "/sign-in"}
                        >
                          {pathname === "/sign-in" ? "Sign Up" : "Sign In"}
                        </Link>
                    </Button>
                </nav>
                <div
                  className="flex flex-col items-center justify-center pt-4 md:pt-14"
                >
                    {children}
                </div>
            </div>
        </main>
    );
}
 
export default AuthLayout;