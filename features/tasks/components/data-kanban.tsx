import React, { useEffect, useState, useCallback } from "react";
import {
    Droppable,
    Draggable,
    DragDropContext,
    type DropResult
} from "@hello-pangea/dnd";

import KanbanColumnHeader from "./kanban-column-header";
import KanbanCard from "./kanban-card";

import { Task, TaskStatus } from "../types";

interface DataKanbanProps {
    data: Task[];
    onChange: (tasks: {
        $id: string;
        status: TaskStatus;
        position: number
    }[]) => void;
}

const boards: TaskStatus[] = [
    TaskStatus.BACKLOG,
    TaskStatus.TODO,
    TaskStatus.IN_PROGRESS,
    TaskStatus.IN_REVIEW,
    TaskStatus.DONE,
];

type TaskState = {
    [key in TaskStatus]: Task[];
};

const DataKanban = ({ data, onChange }: DataKanbanProps) => {
    const [tasks, setTasks] = useState<TaskState>(() => {
        const initialTasks: TaskState = {
            [TaskStatus.BACKLOG]: [],
            [TaskStatus.TODO]: [],
            [TaskStatus.IN_PROGRESS]: [],
            [TaskStatus.IN_REVIEW]: [],
            [TaskStatus.DONE]: [],
        };

        data.forEach((task) => {
            initialTasks[task.status].push(task);
        });

        Object.keys(initialTasks).forEach((status) => {
            initialTasks[status as TaskStatus].sort((a, b) => a.position - b.position);
        });

        return initialTasks;
    });

    useEffect(() => {
        const newTasks: TaskState = {
            [TaskStatus.BACKLOG]: [],
            [TaskStatus.TODO]: [],
            [TaskStatus.IN_PROGRESS]: [],
            [TaskStatus.IN_REVIEW]: [],
            [TaskStatus.DONE]: [],
        };

        data.forEach((task) => {
            newTasks[task.status].push(task);
        });

        Object.keys(newTasks).forEach((status) => {
            newTasks[status as TaskStatus].sort((a, b) => a.position - b.position);
        });

        setTasks(newTasks);
    }, [data]);

    const onDragEnd = useCallback((result: DropResult) => {
        // Check if there is no drop destination. If true, break the function
        if (!result.destination) return;
        
        // Extract the source and destination from the result in the parameter of the parent func
        const { source, destination } = result;

        // Get the source of the drag logic
        const sourceStatus = source.droppableId as TaskStatus;
        // Get the destination of the drag logic
        const destStatus = destination.droppableId as TaskStatus;

        // The properties of the task to be updated in the database
        let updatesPayload: { $id: string; status: TaskStatus; position: number }[] = [];

        setTasks((prevTasks) => {
            const newTasks = { ...prevTasks };

            // Safely remove the task from the source column
            const sourceColumn = [...newTasks[sourceStatus]];
            const [movedTask] = sourceColumn.splice(source.index, 1);

            // If there is no moved task, return the previous state
            if (!movedTask) {
                console.error("No task found at the source index");
                return prevTasks;
            }

            const updatedMovedTask = sourceStatus !== destStatus ? { ...movedTask, status: destStatus } : movedTask;
            // Update the source column
            newTasks[sourceStatus] = sourceColumn;

            // Add task to the destColumn
            const destColumn = [...newTasks[destStatus]];

            destColumn.splice(destination.index, 0, updatedMovedTask);
            // Update the destination column
            newTasks[destStatus] = destColumn;

            updatesPayload = [];

            // Update the moved task
            updatesPayload.push({
                $id: updatedMovedTask.$id,
                status: destStatus,
                position: Math.min((destination.index + 1) * 1000, 1_000_000)
            });

            // Update positions for affected tasks in the destColumn
            newTasks[destStatus].forEach((task, i) => {
                // Check if the task and its ID are not the same as the updated task's ID. If true, create a new position
                if (task && task.$id !== updatedMovedTask.$id) {
                    const newPosition = Math.min((i + 1) * 1000, 1_000_000);
                    
                    // Check if the current task position has not changed. If true, update its status and position
                    if (task.position !== newPosition) {
                        updatesPayload.push({
                            $id: task.$id,
                            status: destStatus,
                            position: newPosition
                        });
                    }
                }
            });
            
            // If the task moved btw columns, update positions in the source column
            if (sourceStatus !== destStatus) {
                newTasks[sourceStatus].forEach((task, i) => {
                    // Check if there are new tasks. If true, create a new position
                    if (newTasks) {
                        const newPosition = Math.min((i + 1) * 1000, 1_000_000);

                        // Check if the task's current position has not changed. If true, change its status and position
                        if (task.position !== newPosition) {
                            updatesPayload.push({
                                $id: task.$id,
                                status: sourceStatus,
                                position: newPosition
                            });
                        }
                    }
                });
            }

            return newTasks;
        });

        onChange(updatesPayload);
    }, [onChange]);

    return (
        <DragDropContext
          onDragEnd={onDragEnd}
        >
            <div
              className="flex overflow-x-auto"
            >
                {boards.map((board) => {
                    return (
                        <div
                          key={board}
                          className="flex-1 mx-2 bg-muted p-1.5 rounded-md min-w-[200px]"
                        >
                            <KanbanColumnHeader
                              board={board}
                              taskCount={tasks[board].length}
                            />
                            <Droppable
                              droppableId={board}
                            >
                                {(provided) => (
                                    <div
                                      {...provided.droppableProps}
                                      ref={provided.innerRef}
                                      className="min-h-[200px] py-1.5"
                                    >
                                        {tasks[board].map((task, i) => (
                                            <Draggable
                                              key={task.$id}
                                              draggableId={task.$id}
                                              index={i}
                                            >
                                                {(provided) => (
                                                    <div
                                                      {...provided.draggableProps}
                                                      {...provided.dragHandleProps}
                                                      ref={provided.innerRef}
                                                    >
                                                        <KanbanCard
                                                          task={task}
                                                        />
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    )
                })}
            </div>
        </DragDropContext>
    );
}
 
export default DataKanban;