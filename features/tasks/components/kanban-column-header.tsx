import {
    CircleCheckIcon,
    CircleDotIcon,
    CircleDashedIcon,
    CircleDotDashedIcon,
    CircleIcon,
    PlusIcon
} from "lucide-react";

import { snakeCaseToTitleCase } from "@/lib/utils";
import { TaskStatus } from "../types";
import React from "react";

interface KanbanColumnHeaderProps {
    board: TaskStatus;
    taskCount: number;
}

const statusIconMap: Record<TaskStatus, React.ReactNode> = {
    [TaskStatus.BACKLOG]: (
      <CircleDashedIcon
        className="size-[18px] text-pink-400"
      />
    ),
    [TaskStatus.TODO]: (
      <CircleIcon
        className="size-[18px] text-red-400"
      />
    ),
    [TaskStatus.IN_PROGRESS]: (
      <CircleIcon
        className="size-[18px] text-yellow-400"
      />
    ),
    [TaskStatus.IN_REVIEW]: (
      <CircleIcon
        className="size-[18px] text-blue-400"
      />
    ),
    [TaskStatus.DONE]: (
      <CircleIcon
        className="size-[18px] text-emerald-400"
      />
    ),
};

const KanbanColumnHeader = ({ board, taskCount }: KanbanColumnHeaderProps) => {
    const Icon = statusIconMap[board];

    return (
        <div
          className="flex items-center justify-between px-2 py-1.5"
        >
          <div
            className="flex items-center gap-x-2"
          >
            {Icon}
            <h2>
              {snakeCaseToTitleCase(board)}
            </h2>
            <div
              className="text-base font-medium"
            >
              ({taskCount >= 1 ? taskCount : 0})
            </div>
          </div>
        </div>
    );
}
 
export default KanbanColumnHeader;