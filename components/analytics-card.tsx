import { FaCaretUp, FaCaretDown } from "react-icons/fa";

import {
    Card,
    CardHeader,
    CardDescription,
    CardTitle
} from "@/components/ui/card";

import { cn } from "@/lib/utils";

interface AnalyticsCardProps {
    title: string;
    value: number;
    variant: "up" | "down";
    increaseValue: number;
}

const AnalyticsCard = ({
    title,
    value,
    variant,
    increaseValue
}: AnalyticsCardProps) => {
    const iconColor = variant === "up" ? "text-emerald-500" : "text-red-500";
    const increaseValueColor = iconColor;
    const Icon = variant === "up" ? FaCaretUp : FaCaretDown;

    return (
        <Card
          className="border-none shadow-none w-full"
        >
            <CardHeader>
                <div
                  className="flex items-center gap-x-2.5"
                >
                    <CardDescription
                      className="flex items-center gap-x-2 font-medium overflow-hidden"
                    >
                        <span
                          className="text-base truncate"
                        >
                            {title}
                        </span>
                    </CardDescription>

                    <div
                      className="flex items-center gap-x-1"
                    >
                        <Icon
                          className={cn(iconColor, "size-4")}
                        />
                        <span
                          className={cn(increaseValueColor, "text-base font-medium truncate")}
                        >
                            {increaseValue}
                        </span>
                    </div>
                </div>

                <CardTitle
                  className="text-3xl font-semibold"
                >
                    {value}
                </CardTitle>
            </CardHeader>
        </Card>
    );
}
 
export default AnalyticsCard;