"use client";

import * as z from "zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { createWorkspaceSchema } from "../schemas";
import { Loader, ImageIcon } from "lucide-react";

import DottedSeparator from "@/components/dotted-separator";
import {
    Card,
    CardTitle,
    CardContent,
    CardHeader
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback
} from "@/components/ui/avatar";

import { useCreateWorkspace } from "@/features/workspaces/api/use-create-workspace";
import { cn } from "@/lib/utils";

interface CreateWorkspaceFormProps {
    onCancel?: () => void;
}

const CreateWorkspaceForm = ({ onCancel }: CreateWorkspaceFormProps) => {
    const router = useRouter();
    const { mutate, isPending } = useCreateWorkspace();

    const inputRef = useRef<HTMLInputElement>(null);

    const form = useForm<z.infer<typeof createWorkspaceSchema>>({
        resolver: zodResolver(createWorkspaceSchema),
        defaultValues: {
            name: ""
        }
    });

    const handleImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];

      if (file) {
        form.setValue("image", file);
      }
    };

    const onSubmit = (values: z.infer<typeof createWorkspaceSchema>) => {
      // Final data to send to the DB
      const finalValues = {
        ...values,
        image: values.image instanceof File ? values.image : ""
      };
      
      mutate({ form: finalValues }, {
        onSuccess: ({ data }) => {
          // Clear the form when completed
          form.reset();
          
          // Redirect users to newly created workspace
          router.push(`/workspaces/${data.$id}`);
        }
      });
    };
    
    return (
        <Card
          className="w-full h-full shadow-none border-none"
        >
            <CardHeader
              className="flex p-7"
            >
                <CardTitle
                  className="text-2xl font-bold"
                >
                    Create a workspace
                    <br />
                    <p
                      className="text-base text-muted-foreground font-normal"
                    >
                      or ask a member of a workspace for a link to join one
                    </p>
                </CardTitle>
            </CardHeader>
            
            <div
              className="px-7"
            >
                <DottedSeparator />
            </div>

            <CardContent
              className="p-7"
            >
                <Form
                  {...form}
                >
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <div
                          className="flex flex-col gap-y-4"
                        >
                            <FormField
                              control={form.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                    <FormLabel
                                      className="text-sm font-medium"
                                    >
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
                                <div
                                  className="flex flex-col gap-y-2"
                                >
                                  <div
                                    className="flex items-center gap-x-5"
                                  >
                                    {field.value ? (
                                      <div
                                        className="size-[72px] relative rounded-md overflow-hidden"
                                      >
                                        <Image
                                          src={field.value instanceof File ? URL.createObjectURL(field.value) : field.value}
                                          alt="Workspace_picture"
                                          fill
                                          className="object-cover"
                                        />
                                      </div>
                                    ) : (
                                      <Avatar
                                        className="size-[72px]"
                                      >
                                        <AvatarFallback>
                                          <ImageIcon
                                            className="size-[36px] text-neutral-400"
                                          />
                                        </AvatarFallback>
                                      </Avatar>
                                    )}

                                    <div
                                      className="flex flex-col"
                                    >
                                      <p
                                        className="text-sm font-medium"
                                      >
                                        Workspace Icon
                                      </p>
                                      <p
                                        className="text-xs text-muted-foreground"
                                      >
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

                        <DottedSeparator
                          className="py-7"
                        />
                        
                        <div
                          className="flex items-center justify-between"
                        >
                            <Button
                              onClick={onCancel}
                              type="button"
                              size="lg"
                              variant="secondary"
                              disabled={isPending}
                              className={cn(
                                "rounded-lg",
                                !onCancel && "invisible"
                              )}
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
                                    <Loader
                                      className="w-4 h-4 mr-2 animate-spin"
                                    />
                                )}
                                Create
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
 
export default CreateWorkspaceForm;