import { Pencil } from "lucide-react";

import OverviewProperty from "./overview-property";
import TaskDate from "./task-date";
import DottedSeparator from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import MemberAvatar from "@/features/members/components/member-avatar";

import { Task } from "../types";

import { snakeCaseToTitleCase } from "@/lib/utils";
import { useUpdateTaskModal } from "../hooks/use-update-task-modal";

interface TaskOverviewProps {
    task: Task;
}

const TaskOverview = ({ task }: TaskOverviewProps) => {
    const { open } = useUpdateTaskModal();

    return (
        <div
          className="flex flex-col gap-y-4 col-span-1"
        >
            <div
              className="bg-muted rounded-lg p-4"
            >
                <div
                  className="flex items-center justify-between"
                >
                    <p
                      className="text-lg font-semibold"
                    >
                        Overview
                    </p>
                    <Button
                      onClick={() => open(task.$id)}
                      size="sm"
                      variant="secondary"
                    >
                        <Pencil
                          className="size-4 mr-2"
                        />
                        Edit
                    </Button>
                </div>

                <DottedSeparator
                  className="my-4"
                />

                <div
                  className="flex flex-col gap-y-4"
                >
                    <OverviewProperty
                      label="Name"
                    >
                        <p
                          className="text-sm font-medium"
                        >
                            {task.name}
                        </p>
                    </OverviewProperty>
                    <OverviewProperty
                      label="Assignee"
                    >
                        <MemberAvatar
                          name={task.assignee.name}
                          className="size-6"
                        />
                        <p
                          className="text-sm font-medium"
                        >
                            {task.assignee.name}
                        </p>
                    </OverviewProperty>
                    <OverviewProperty
                      label="Due date"
                    >
                        <TaskDate
                          className="text-sm font-medium"
                          value={task.dueDate}
                        />
                    </OverviewProperty>
                    <OverviewProperty
                      label="Status"
                    >
                        <Badge
                          className="rounded-full"
                          variant={task.status}
                        >
                            {snakeCaseToTitleCase(task.status)}
                        </Badge>
                    </OverviewProperty>
                </div>
            </div>
        </div>
    );
}
 
export default TaskOverview;