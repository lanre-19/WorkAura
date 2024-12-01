"use client";

import { FolderIcon, ListChecksIcon, UserIcon } from "lucide-react";

import DatePicker from "@/components/date-picker";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectSeparator,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";

import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

import { TaskStatus } from "../types";
import { useTaskFilters } from "../hooks/use-task-filters";

interface DataFiltersProps {
    hideProjectFilter?: boolean;
}

const DataFilters = ({ hideProjectFilter }: DataFiltersProps) => {
    const workspaceId = useWorkspaceId();

    const { data: projects, isLoading: isLoadingProjects } = useGetProjects({ workspaceId });
    const { data: members, isLoading: isLoadingMembers } = useGetMembers({ workspaceId });

    const isLoading = isLoadingProjects || isLoadingMembers;

    const projectsOptions = projects?.documents.map((project) => ({
        value: project.$id,
        label: project.name,

    }));

    const membersOptions = members?.documents.map((member) => ({
        value: member.$id,
        label: member.name
    }));

    const [{
        status,
        assigneeId,
        projectId,
        dueDate
    }, setFilters] = useTaskFilters();

    const onStatusChange = (value: string) => {
        setFilters({ status: value === "all" ? null : value as TaskStatus });
    };

    const onAssigneeChange = (value: string) => {
        setFilters({ assigneeId: value === "all" ? null : value as string });
    };

    const onProjectChange = (value: string) => {
        setFilters({ projectId: value === "all" ? null : value as string });
    };

    if (isLoading) {
        return null;
    }

    return (
        <div
          className="flex flex-col lg:flex-row gap-2"
        >
            <Select
              onValueChange={(value) => onStatusChange(value)}
              defaultValue={status ?? undefined}
            >
                <SelectTrigger
                  className="w-full lg:w-auto h-8"
                >
                    <div
                      className="flex items-center pr-2"
                    >
                        <ListChecksIcon
                          className="size-4 mr-2"
                        />
                        <SelectValue
                          placeholder="All statuses"
                        />
                    </div>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem
                      value="all"
                    >
                        All statuses
                    </SelectItem>
                    <SelectSeparator />
                    <SelectItem
                      value={TaskStatus.BACKLOG}
                    >
                        Backlog
                    </SelectItem>
                    <SelectItem
                      value={TaskStatus.IN_PROGRESS}
                    >
                        In Progress
                    </SelectItem>
                    <SelectItem
                      value={TaskStatus.IN_REVIEW}
                    >
                        In Review
                    </SelectItem>
                    <SelectItem
                      value={TaskStatus.TODO}
                    >
                        Todo
                    </SelectItem>
                    <SelectItem
                      value={TaskStatus.DONE}
                    >
                        Done
                    </SelectItem>
                </SelectContent>
            </Select>

            <Select
              onValueChange={(value) => onAssigneeChange(value)}
              defaultValue={assigneeId ?? undefined}
            >
                <SelectTrigger
                  className="w-full lg:w-auto h-8"
                >
                    <div
                      className="flex items-center pr-2"
                    >
                        <UserIcon
                          className="size-4 mr-2"
                        />
                        <SelectValue
                          placeholder="All assignees"
                        />
                    </div>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem
                      value="all"
                    >
                        All assignees
                    </SelectItem>
                    <SelectSeparator />
                    {membersOptions?.map((member) => (
                        <SelectItem
                          key={member.label}
                          value={member.value}
                        >
                            {member.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {!hideProjectFilter && (
              <Select
                onValueChange={(value) => onProjectChange(value)}
                defaultValue={projectId ?? undefined}
              >
                <SelectTrigger
                  className="w-full lg:w-auto h-8"
                >
                  <div
                    className="flex items-center pr-2"
                  >
                    <FolderIcon
                      className="size-4 mr-2"
                    />
                    <SelectValue
                      placeholder="All projects"
                    />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    value="all"
                  >
                    All projects
                  </SelectItem>
                  <SelectSeparator />
                  {projectsOptions?.map((project) => (
                    <SelectItem
                      key={project.label}
                      value={project.value}
                    >
                      {project.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <DatePicker
              onChange={(date) => {
                setFilters({ dueDate: date ? date.toISOString() : null })
              }}
              className="w-full h-8 lg:w-auto text-black"
              placeholder="Due date"
              value={dueDate ? new Date(dueDate) : undefined}
            />
        </div>
    );
}
 
export default DataFilters;