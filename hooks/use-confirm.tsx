import { useState } from "react";

import ResponsiveModal from "@/components/responsive-modal";
import { Button, type ButtonProps } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardContent,
    CardDescription,
    CardTitle
} from "@/components/ui/card";

export const useConfirm = (
    title: string,
    message: string,
    variant: ButtonProps["variant"] = "primary"
): [() => JSX.Element, () => Promise<unknown>] => {
    const [promise, setPromise] = useState<{ resolve: (value: boolean) => void } | null>(null);

    const confirm = () => {
        return new Promise((resolve) => {
            setPromise({ resolve });
        });
    };

    const handleClose = () => {
        setPromise(null);
    };

    const handleConfirm = () => {
        promise?.resolve(true);
        handleClose();
    };

    const handleCancel = () => {
        promise?.resolve(false);
        handleClose();
    };

    const ConfirmDialog = () => (
        <ResponsiveModal
          open={promise !== null}
          onOpenChange={handleClose}
        >
            <Card
              className="w-full h-full border-none shadow-none"
            >
                <CardContent
                  className="pt-8"
                >
                    <CardHeader
                      className="p-0"
                    >
                        <CardTitle>
                            {title}
                        </CardTitle>
                        <CardDescription>
                            {message}
                        </CardDescription>
                    </CardHeader>

                    <div
                      className="flex flex-col w-full pt-4 gap-y-2 lg:flex-row gap-x-2 items-center justify-end"
                    >
                        <Button
                          onClick={handleCancel}
                          className="w-full lg:w-auto"
                          variant="outline"
                        >
                            Cancel
                        </Button>
                        <Button
                          onClick={handleConfirm}
                          className="w-full lg:w-auto"
                          variant={variant}
                        >
                            Confirm
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </ResponsiveModal>
    );

    return [ConfirmDialog, confirm];
};