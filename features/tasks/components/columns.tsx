"use client";

import { ArrowUpDown, MoreVertical } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

import TaskDate from "./task-date";
import TaskActions from "./task-actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

import ProjectsAvatar from "@/features/projects/components/projects-avatar";
import MemberAvatar from "@/features/members/components/member-avatar";

import { snakeCaseToTitleCase } from "@/lib/utils";
import { Task, TaskStatus } from "../types";
import { useUpdateTask } from "../api/use-update-task";

export const columns: ColumnDef<Task>[] = [
  {
    id: "checkbox",
    cell: ({ row }) => {
      const task = row.original;

      const { mutate } = useUpdateTask();

      const handleStatusChange = () => {
        mutate({
          json: {
              status: TaskStatus.DONE
          },
          param: {
              taskId: task.$id
            }
          },
        );
      };

      return (
        <Checkbox
          checked={task.status === TaskStatus.DONE}
          onCheckedChange={handleStatusChange}
        />
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="hover:bg-transparent p-0"
        variant="ghost"
      >
        Task name
        <ArrowUpDown className="size-4 ml-2" />
      </Button>
    ),
    cell: ({ row }) => <p className="line-clamp-1">{row.original.name}</p>,
  },
  {
    accessorKey: "project",
    header: ({ column }) => (
      <Button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="hover:bg-transparent p-0"
        variant="ghost"
      >
        Project
        <ArrowUpDown className="size-4 ml-2" />
      </Button>
    ),
    cell: ({ row }) => {
      const project = row.original.project;
      return (
        <div className="flex items-center text-sm font-medium gap-x-2">
          <ProjectsAvatar
            className="size-6"
            name={project.name}
            image={project.imageUrl}
          />
          <p className="line-clamp-1">{project.name}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "assignee",
    header: ({ column }) => (
      <Button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="hover:bg-transparent p-0"
        variant="ghost"
      >
        Assignee
        <ArrowUpDown className="size-4 ml-2" />
      </Button>
    ),
    cell: ({ row }) => {
      const assignee = row.original.assignee;
      return (
        <div className="flex items-center text-sm font-medium gap-x-2">
          <MemberAvatar
            className="size-6"
            fallbackClassName="text-xs"
            name={assignee.name}
          />
          <p className="line-clamp-1">{assignee.name}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => (
      <Button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="hover:bg-transparent p-0"
        variant="ghost"
      >
        Due date
        <ArrowUpDown className="size-4 ml-2" />
      </Button>
    ),
    cell: ({ row }) => <TaskDate value={row.original.dueDate} />,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="hover:bg-transparent p-0"
        variant="ghost"
      >
        Status
        <ArrowUpDown className="size-4 ml-2" />
      </Button>
    ),
    cell: ({ row }) => (
      <Badge className="rounded-full" variant={row.original.status}>
        {snakeCaseToTitleCase(row.original.status)}
      </Badge>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { $id, projectId } = row.original;
      return (
        <TaskActions id={$id} projectId={projectId}>
          <Button className="size-8 p-0" variant="ghost">
            <MoreVertical className="size-4 text-muted-foreground" />
          </Button>
        </TaskActions>
      );
    },
  },
];
