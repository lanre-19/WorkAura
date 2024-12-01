import { ProjectAnalyticsResponseType } from "@/features/projects/api/use-get-project-analytics";

import AnalyticsCard from "./analytics-card";
import DottedSeparator from "./dotted-separator";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const Analytics = ({ data }: ProjectAnalyticsResponseType) => {
    if (!data) {
        return null;
    }

    return (
        <ScrollArea
          className="border rounded-lg w-full whitespace-nowrap shrink-0"
        >
            <div
              className="flex flex-row w-full"
            >
                <div
                  className="flex items-center flex-1"
                >
                    <AnalyticsCard
                      title="Total Tasks"
                      value={data.taskCount}
                      variant={data.taskDifference > 0 ? "up" : "down"}
                      increaseValue={data.taskDifference}
                    />
                    <DottedSeparator
                      direction="vertical"
                    />
                </div>
                <div
                  className="flex items-center flex-1"
                >
                    <AnalyticsCard
                      title="Assigned Tasks"
                      value={data.assignedTaskCount}
                      variant={data.assignedTaskDifference > 0 ? "up" : "down"}
                      increaseValue={data.assignedTaskDifference}
                    />
                    <DottedSeparator
                      direction="vertical"
                    />
                </div>
                <div
                  className="flex items-center flex-1"
                >
                    <AnalyticsCard
                      title="Completed Tasks"
                      value={data.completedTasksCount}
                      variant={data.completedTasksDifference > 0 ? "up" : "down"}
                      increaseValue={data.completedTasksDifference}
                    />
                    <DottedSeparator
                      direction="vertical"
                    />
                </div>
                <div
                  className="flex items-center flex-1"
                >
                    <AnalyticsCard
                      title="Overdue Tasks"
                      value={data.overdueTasksCount}
                      variant={data.overdueTasksDifference > 0 ? "up" : "down"}
                      increaseValue={data.overdueTasksDifference}
                    />
                    <DottedSeparator
                      direction="vertical"
                    />
                </div>
                <div
                  className="flex items-center flex-1"
                >
                    <AnalyticsCard
                      title="Incomplete Tasks"
                      value={data.incompleteTasksCount}
                      variant={data.incompleteTasksDifference > 0 ? "up" : "down"}
                      increaseValue={data.incompleteTasksDifference}
                    />
                </div>
            </div>
            <ScrollBar
              orientation="horizontal"
            />
        </ScrollArea>
    );
}
 
export default Analytics;