"use client";

import * as z from "zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";

import DottedSeparator from "@/components/dotted-separator";
import DatePicker from "@/components/date-picker";
import {
  Card,
  CardTitle,
  CardContent,
  CardHeader
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger
} from "@/components/ui/select";
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
import { Textarea } from "@/components/ui/textarea";

import ProjectsAvatar from "@/features/projects/components/projects-avatar";
import MemberAvatar from "@/features/members/components/member-avatar";
import { useCreateTask } from "@/features/tasks/api/use-create-task";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

import { cn } from "@/lib/utils";
import { createTaskSchema } from "../schemas";
import { TaskStatus } from "../types";

interface CreateTaskFormProps {
  onCancel?: () => void;
  projectOptions: { id: string, name: string, imageUrl: string }[];
  memberOptions: { id: string, name: string }[];
}

const CreateTaskForm = ({
  onCancel,
  projectOptions,
  memberOptions
}: CreateTaskFormProps) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const { mutate, isPending } = useCreateTask();

  const form = useForm<z.infer<typeof createTaskSchema>>({
    resolver: zodResolver(createTaskSchema.omit({ workspaceId: true })),
    defaultValues: {
      workspaceId
    },
  });

  const onSubmit = (values: z.infer<typeof createTaskSchema>) => {
    mutate(
      { json: { ...values, workspaceId } },
      {
        onSuccess: ({ data }) => {
          // Clear the form when completed
          form.reset();

          // TODO: Redirect to newly created task
          onCancel?.();
        },
      }
    );
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
          Create a task
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
                      Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="E.g. Commit changes"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className="text-sm font-medium"
                    >
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="E.g. Push code to Github"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className="text-sm font-medium"
                    >
                      Due Date
                    </FormLabel>
                    <FormControl>
                      <DatePicker
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="assigneeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className="text-sm font-medium"
                    >
                      Assignee
                    </FormLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder="Select an assignee"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <FormMessage />
                      <SelectContent>
                        {memberOptions.map((member) => (
                          <SelectItem
                            key={member.id}
                            value={member.id}
                          >
                            <div
                              className="flex items-center gap-x-2"
                            >
                              <MemberAvatar
                                className="size-6"
                                name={member.name}
                              />
                              {member.name}
                            </div> 
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className="text-sm font-medium"
                    >
                      Status
                    </FormLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder="Select a status"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <FormMessage />
                      <SelectContent>
                        <SelectItem
                          value={TaskStatus.DONE}
                        >
                          Done
                        </SelectItem>
                        <SelectItem
                          value={TaskStatus.TODO}
                        >
                          Todo
                        </SelectItem>
                        <SelectItem
                          value={TaskStatus.IN_REVIEW}
                        >
                          In Review
                        </SelectItem>
                        <SelectItem
                          value={TaskStatus.IN_PROGRESS}
                        >
                          In Progress
                        </SelectItem>
                        <SelectItem
                          value={TaskStatus.BACKLOG}
                        >
                          Backlog
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="projectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className="text-sm font-medium"
                    >
                      Project
                    </FormLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder="Select a project"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <FormMessage />
                      <SelectContent>
                        {projectOptions.map((project) => (
                          <SelectItem
                            key={project.id}
                            value={project.id}
                          >
                            <div
                              className="flex items-center gap-x-2"
                            >
                              <ProjectsAvatar
                                className="size-6"
                                name={project.name}
                                image={project.imageUrl}
                              />
                              {project.name}
                            </div> 
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
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
                {isPending && <Loader className="w-4 h-4 mr-2 animate-spin" />}
                Create
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreateTaskForm;
