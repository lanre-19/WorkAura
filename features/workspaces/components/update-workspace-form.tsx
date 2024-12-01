"use client";

import * as z from "zod";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateWorkspaceSchema } from "../schemas";
import { Loader, ImageIcon, CopyIcon } from "lucide-react";

import DottedSeparator from "@/components/dotted-separator";
import { Card, CardTitle, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { useUpdateWorkspace } from "../api/use-update-workspace";
import { useDeleteWorkspace } from "../api/use-delete-workspace";
import { useResetInviteCode } from "../api/use-reset-invite-code";

import { cn } from "@/lib/utils";
import { useConfirm } from "@/hooks/use-confirm";
import { Workspace } from "../types";


interface UpdateWorkspaceFormProps {
  onCancel?: () => void;
  initialValues: Workspace;
}

const UpdateWorkspaceForm = ({
  onCancel,
  initialValues,
}: UpdateWorkspaceFormProps) => {
  const router = useRouter();
  const { mutate, isPending } = useUpdateWorkspace();
  const { mutate: deleteWorkspace, isPending: isDeletingWorkspace } = useDeleteWorkspace();
  const { mutate: resetInviteCode, isPending: isResettingInviteCode } = useResetInviteCode();

  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete Workspace",
    "Are you sure? This workspace will be deleted permanently.",
    "destructive"
  );

  const [ResetDialog, confirmReset] = useConfirm(
    "Reset Invitation Link",
    "Are you sure? This invitation link will be reset, and the former links will be rendered invalid.",
    "destructive"
  );

  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof updateWorkspaceSchema>>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: {
      ...initialValues,
      image: initialValues.imageUrl ?? "",
    },
  });

  const handleImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      form.setValue("image", file);
    }
  };

  const handleDeleteWorkspace = async () => {
    const ok = await confirmDelete();

    if (!ok) return;

    deleteWorkspace({
      param: { workspaceId: initialValues.$id }
    });
  };

  const handleResetInvitationLink = async () => {
    const ok = await confirmReset();

    if (!ok) return;

    resetInviteCode({
      param: { workspaceId: initialValues.$id }
    });
  };

  const onSubmit = (values: z.infer<typeof updateWorkspaceSchema>) => {
    // Final data to send to the DB
    const finalValues = {
      ...values,
      image: values.image instanceof File ? values.image : "",
    };

    mutate(
      {
        form: finalValues,
        param: { workspaceId: initialValues.$id },
      }
    );
  };

  const fullInviteLink = `${window.location.origin}/workspaces/${initialValues.$id}/join/${initialValues.inviteCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullInviteLink).then(() => toast.success("Invite link copied to clipboard!"));
  };

  return (
    <div
      className="flex flex-col gap-y-4"
    >
      <DeleteDialog />
      <ResetDialog />
      <Card className="w-full h-full shadow-none border-none">
        <CardHeader className="flex flex-row items-center gap-x-7 p-7 space-y-0">
          <Button
            onClick={
              onCancel
                ? onCancel
                : () => router.back()
            }
            size="xs"
            variant="secondary"
          >
            Back
          </Button>
          <CardTitle className="text-2xl font-bold">
            {initialValues.name}
          </CardTitle>
        </CardHeader>

        <div className="px-7">
          <DottedSeparator />
        </div>

        <CardContent className="p-7">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Workspace Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="E.g. Backend team"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <div className="flex flex-col gap-y-2">
                      <div className="flex items-center gap-x-5">
                        {field.value ? (
                          <div className="size-[72px] relative rounded-md overflow-hidden">
                            <Image
                              src={
                                field.value instanceof File
                                  ? URL.createObjectURL(field.value)
                                  : field.value
                              }
                              alt="Workspace_picture"
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <Avatar className="size-[72px]">
                            <AvatarFallback>
                              <ImageIcon className="size-[36px] text-neutral-400" />
                            </AvatarFallback>
                          </Avatar>
                        )}

                        <div className="flex flex-col">
                          <p className="text-sm font-medium">Workspace Icon</p>
                          <p className="text-xs text-muted-foreground">
                            JPG, PNG, JPEG or PNG max 1MB
                          </p>
                          <input
                            onChange={handleImgChange}
                            className="hidden"
                            type="file"
                            accept=".jpg, .png, .jpeg, .svg"
                            ref={inputRef}
                            disabled={isPending}
                          />
                          {field.value ? (
                            <Button
                              onClick={() => {
                                field.onChange(null);

                                if (inputRef.current) {
                                  inputRef.current.value = "";
                                }
                              }}
                              className="w-fit mt-2"
                              type="button"
                              size="xs"
                              variant="destructive"
                              disabled={isPending}
                            >
                              Remove Image
                            </Button>
                          ) : (
                            <Button
                              onClick={() => inputRef.current?.click()}
                              className="w-fit mt-2"
                              type="button"
                              size="xs"
                              variant="teritary"
                              disabled={isPending}
                            >
                              Upload Image
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                />
              </div>

              <DottedSeparator className="py-7" />

              <div className="flex items-center justify-between">
                <Button
                  onClick={onCancel}
                  type="button"
                  size="lg"
                  variant="secondary"
                  disabled={isPending}
                  className={cn("rounded-lg", !onCancel && "invisible")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  disabled={isPending}
                  className="rounded-lg"
                >
                  {isPending && (
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  Save
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card
        className="w-full h-full shadow-none border-none"
      >
        <CardContent
          className="p-7"
        >
          <div
            className="flex flex-col"
          >
            <h2
              className="text-lg font-bold"
            >
              Invite Members
            </h2>
            <p
              className="text-sm text-muted-foreground"
            >
              Use the invite link to invite members to your workspace.
            </p>

            <div
              className="mt-4"
            >
              <div
                className="flex items-center"
              >
                <Input
                  value={fullInviteLink}
                  className="rounded-r-none"
                  disabled
                />
                <Button
                  onClick={handleCopy}
                  className="size-12 rounded-l-none"
                  variant="secondary"
                >
                  <CopyIcon
                    className="size-5"
                  />
                </Button>
              </div>
            </div>

            <DottedSeparator
              className="py-7"
            />

            <Button
              onClick={handleResetInvitationLink}
              className="mt-6 w-fit ml-auto"
              type="button"
              size="sm"
              variant="destructive"
              disabled={isPending || isResettingInviteCode}
            >
              Reset link
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card
        className="w-full h-full shadow-none border border-amber-500"
      >
        <CardContent
          className="p-7"
        >
          <div
            className="flex flex-col"
          >
            <h2
              className="text-lg text-amber-600 font-bold"
            >
              Danger Zone
            </h2>
            <p
              className="text-sm text-muted-foreground"
            >
              Deleting this workspace is irreversible. Members, tasks and related data will be deleted permanently.
            </p>

            <DottedSeparator
              className="py-7"
            />

            <Button
              onClick={handleDeleteWorkspace}
              className="mt-6 w-fit ml-auto"
              type="button"
              size="sm"
              variant="destructive"
              disabled={isPending || isDeletingWorkspace}
            >
              Delete workspace
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdateWorkspaceForm;
