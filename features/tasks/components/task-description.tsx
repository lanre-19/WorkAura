import { useState } from "react";
import { Loader, Pencil, X } from "lucide-react";

import DottedSeparator from "@/components/dotted-separator";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { useUpdateTask } from "../api/use-update-task";

import { cn } from "@/lib/utils";
import { Task } from "../types";

interface TaskDescriptionProps {
    task: Task;
}

const TaskDescription = ({ task }: TaskDescriptionProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(task.description);

    const { mutate, isPending } = useUpdateTask();

    const handleSave = () => {
        mutate({
            json: {
                description: value
            },
            param: {
                taskId: task.$id
            }
        }, {
            onSuccess: () => {
                setIsEditing(false);
            }
        });
    };

    return (
        <div
          className="p-4 border rounded-lg"
        >
            <div
              className="flex items-center justify-between"
            >
                <p
                  className="text-lg font-semibold"
                >
                    Description
                </p>
                <Button
                  onClick={() => setIsEditing((prev) => !prev)}
                  size="sm"
                  variant="secondary"
                >
                    {isEditing ? (
                        <X
                          className="size-4 mr-2"
                        />
                    ) : (
                        <Pencil
                          className="size-4 mr-2"
                        />
                    )}
                    {isEditing ? "Cancel" : "Edit"}
                </Button>
            </div>

            <DottedSeparator
              className="my-4"
            />

            {isEditing ? (
                <div
                  className="flex flex-col gap-y-4"
                >
                    <Textarea
                      onChange={(e) => setValue(e.target.value)}
                      value={value}
                      placeholder="Add a description"
                      rows={4}
                      disabled={isPending}
                    />

                    <Button
                      onClick={handleSave}
                      className="w-fit ml-auto"
                      size="sm"
                      disabled={isPending}
                    >
                        {isPending && (
                            <Loader
                              className="size-4 mr-2 animate-spin"
                            />
                        )}
                        Save
                    </Button>
                </div>
            ) : (
                <div
                  className={cn(
                    task.description && "text-base"
                  )}
                >
                    {task.description || (
                        <span
                          className="text-sm text-muted-foreground italic"
                        >
                            No Description
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
 
export default TaskDescription;