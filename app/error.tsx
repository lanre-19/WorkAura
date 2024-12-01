"use client";

import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";

const ErrorPage = () => {
    const onClick = () => {
      window.location.reload();
    };

    return (
        <div
          className="flex flex-col gap-y-3 items-center justify-center h-screen"
        >
            <AlertTriangle
              className="size-10 text-neutral-400"
            />
            <p
              className="text-lg font-semibold text-muted-foreground"
            >
                Something went wrong
            </p>

            <Button
              onClick={onClick}
              size="sm"
              variant="secondary"
            >
              Refresh page
            </Button>
        </div>
    );
}
 
export default ErrorPage;