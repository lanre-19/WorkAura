"use client";

import { useCallback } from "react";
import { Loader, PlusIcon } from "lucide-react";
import { useQueryState } from "nuqs";

import DataFilters from "./data-filters";
import DataCalendar from "./data-calendar";
import DataKanban from "./data-kanban";
import DottedSeparator from "@/components/dotted-separator";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs";

import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useProjectId } from "@/features/projects/hooks/use-project-id";

import { useGetTasks } from "../api/use-get-tasks";
import { useBulkUpdateTask } from "../api/use-bulk-update-tasks";
import { useCreateTaskModal } from "../hooks/use-create-task-modal";
import { useTaskFilters } from "../hooks/use-task-filters";
import { TaskStatus } from "../types";

interface TasksViewSwitcherProps {
  hideProjectFilter?: boolean;
}

const TasksViewSwitcher = ({ hideProjectFilter }: TasksViewSwitcherProps) => {
    const [{
      status,
      assigneeId,
      projectId,
      dueDate
    }] = useTaskFilters();
    const [view, setView] = useQueryState("task-view", { defaultValue: "table" });

    const workspaceId = useWorkspaceId();
    const paramProjectId = useProjectId();

    const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({
      workspaceId,
      status,
      assigneeId,
      projectId: paramProjectId || projectId,
      dueDate
    });
    const { mutate: updateTasks } = useBulkUpdateTask();

    const { open } = useCreateTaskModal();

    const onKanbanChange = useCallback(( tasks: {
      $id: string;
      status: TaskStatus;
      position: number
    }[] ) => {
      updateTasks({
        json: { tasks }
      });
    }, [updateTasks]);

    return (
        <Tabs
          className="flex-1 w-full border rounded-lg"
          defaultValue={view}
          onValueChange={setView}
        >
            <div
              className="flex flex-col h-full overflow-auto p-4"
            >
                <div
                  className="flex flex-col gap-y-2 lg:flex-row items-center justify-between"
                >
                    <TabsList
                      className="w-full lg:w-auto"
                    >
                        <TabsTrigger
                          className="w-full h-8 lg:w-auto"
                          value="table"
                        >
                            Table
                        </TabsTrigger>
                        <TabsTrigger
                          className="w-full h-8 lg:w-auto"
                          value="kanban"
                        >
                            Kanban
                        </TabsTrigger>
                        <TabsTrigger
                          className="w-full h-8 lg:w-auto"
                          value="calendar"
                        >
                            Calendar
                        </TabsTrigger>
                    </TabsList>
                    
                    <Button
                      onClick={open}
                      className="w-full lg:w-auto"
                      size="sm"
                    >
                        <PlusIcon
                          className="size-4 mr-2"
                        />
                        New
                    </Button>
                </div>

                <DottedSeparator
                  className="my-4"
                />

                <DataFilters
                  hideProjectFilter={hideProjectFilter}
                />

                <DottedSeparator
                  className="my-4"
                />

                {isLoadingTasks ? (
                  <div
                    className="flex flex-col items-center justify-center w-full h-[200px] border rounded-lg"
                  >
                    <Loader
                      className="size-5 text-muted-foreground animate-spin"
                    />
                  </div>
                )
                : (
                <>
                  <TabsContent
                    className="m-0"
                    value="table"
                  >
                    <DataTable
                      columns={columns}
                      data={tasks?.documents ?? []}
                    />
                  </TabsContent>
                  <TabsContent
                    className="m-0"
                    value="kanban"
                  >
                    <DataKanban
                      data={tasks?.documents ?? []}
                      onChange={onKanbanChange}
                    />
                  </TabsContent>
                  <TabsContent
                    className="m-0 h-full pb-4"
                    value="calendar"
                  >
                    <DataCalendar
                      data={tasks?.documents ?? []}
                    />
                  </TabsContent>
                </>)}
            </div>
        </Tabs>
    );
}
 
export default TasksViewSwitcher;